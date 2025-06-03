require('dotenv').config()
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

AWS.config.update({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

//  wait for DynamoDB function
const waitForDynamoDB = async () => {
  console.log('Waiting for DynamoDB to be ready...');
  let retries = 30;
  
  while (retries > 0) {
    try {
      await dynamodb.listTables().promise();
      console.log('DynamoDB is ready!');
      return true;
    } catch (err) {
      console.log(`Waiting for DynamoDB... (${retries} retries left)`);
      retries--;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error('DynamoDB failed to start');
};

// Create table on startup
dynamodb.createTable({
  TableName: 'Users',
  KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
  BillingMode: 'PAY_PER_REQUEST'
}, (err) => {
  if (err && err.code !== 'ResourceInUseException') {
    console.error('Error creating table:', err);
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    await docClient.put({
      TableName: 'Users',
      Item: { email, password, name }
    }).promise();
    res.json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await docClient.get({
      TableName: 'Users',
      Key: { email }
    }).promise();
    
    if (!result.Item || result.Item.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful!', user: { email, name: result.Item.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Get visited states for a user
app.get('/api/visited-states/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    const result = await docClient.get({
      TableName: 'UserStates',
      Key: { email }
    }).promise();
    
    res.json({ states: result.Item ? result.Item.states : [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching states' });
  }
});

// Save visited states
app.post('/api/visited-states', async (req, res) => {
  const { email, states } = req.body;
  console.log('Saving states for:', email, states);
  
  try {
    await docClient.put({
      TableName: 'UserStates',
      Item: { 
        email, 
        states,
        updatedAt: new Date().toISOString()
      }
    }).promise();
    
    console.log('States saved successfully for:');
    res.json({ message: 'States saved successfully' });
  } catch (err) {
    console.error('Error saving states:', err);
    res.status(500).json({ message: 'Error saving states' });
  }
});

// Add table creation for UserStates
async function initializeDatabase() {
  console.log('Initializing database tables...');

   await waitForDynamoDB();
  
  try {
    // Create Users table
    await dynamodb.createTable({
      TableName: 'Users',
      KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
      BillingMode: 'PAY_PER_REQUEST'
    }).promise();
    console.log('Users table created');
  } catch (err) {
    if (err.code === 'ResourceInUseException') {
      console.log('Users table already exists');
    } else {
      console.error('Error creating Users table:', err);
    }
  }

  try {
    // Create UserStates table
    await dynamodb.createTable({
      TableName: 'UserStates',
      KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
      BillingMode: 'PAY_PER_REQUEST'
    }).promise();
    console.log('UserStates table created');
  } catch (err) {
    if (err.code === 'ResourceInUseException') {
      console.log('UserStates table already exists');
    } else {
      console.error('Error creating UserStates table:', err);
    }
  }
}

// Initialize database before starting server
initializeDatabase().then(() => {
  app.listen(8001, '0.0.0.0', () => console.log('Server running on port 8001'));
}).catch(err => {
  console.error('Failed to initialize database:', err);
});