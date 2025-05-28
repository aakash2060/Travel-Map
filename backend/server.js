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
  
  try {
    await docClient.put({
      TableName: 'UserStates',
      Item: { 
        email, 
        states,
        updatedAt: new Date().toISOString()
      }
    }).promise();
    
    res.json({ message: 'States saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving states' });
  }
});

// Add table creation for UserStates
dynamodb.createTable({
  TableName: 'UserStates',
  KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
  BillingMode: 'PAY_PER_REQUEST'
}, (err) => {
  if (err && err.code !== 'ResourceInUseException') {
    console.error('Error creating UserStates table:', err);
  }
});

app.listen(8001, () => console.log('Server running on port 8001'));