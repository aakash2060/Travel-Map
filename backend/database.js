const AWS = require('aws-sdk');

// AWS Configuration
AWS.config.update({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// Wait for DynamoDB function
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

// Initialize database tables
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

module.exports = {
  dynamodb,
  docClient,
  initializeDatabase
};