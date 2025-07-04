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

// const deleteTableIfExists = async (tableName) => {
//   try {
//     console.log(`Deleting ${tableName} table...`);
//     await dynamodb.deleteTable({ TableName: tableName }).promise();
//     console.log(`${tableName} table deletion initiated`);
    
//     // Wait for table to be fully deleted
//     let deleted = false;
//     let retries = 30;
//     while (!deleted && retries > 0) {
//       try {
//         await dynamodb.describeTable({ TableName: tableName }).promise();
//         console.log(`Waiting for ${tableName} to be deleted... (${retries} retries left)`);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         retries--;
//       } catch (err) {
//         if (err.code === 'ResourceNotFoundException') {
//           deleted = true;
//           console.log(`${tableName} fully deleted`);
//         }
//       }
//     }
//   } catch (err) {
//     if (err.code === 'ResourceNotFoundException') {
//       console.log(`${tableName} table doesn't exist, skipping deletion`);
//     } else {
//       console.error(`Error deleting ${tableName}:`, err.message);
//     }
//   }
// }

// Initialize database tables
async function initializeDatabase() {
  console.log('Initializing database tables...');
  
  await waitForDynamoDB();


//   console.log('Deleting existing tables to recreate with proper EmailIndex...');
//   await deleteTableIfExists('Users');
//   await deleteTableIfExists('UserMaps');
  
  try {
    await dynamodb.createTable({
      TableName: 'Users',
      KeySchema: [{ AttributeName: 'uid', KeyType: 'HASH' }],
      AttributeDefinitions: [ { AttributeName: 'uid', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' }],
        GlobalSecondaryIndexes: [
        {
          IndexName: 'EmailIndex',
          KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
        },
      ],
      BillingMode: 'PAY_PER_REQUEST'
    }).promise();
    console.log('Users table created with autogennerated UID');
  } catch (err) {
    if (err.code === 'ResourceInUseException') {
      console.log('Users table already exists');
    } else {
      console.error('Error creating Users table:', err);
    }
  }

  try {
    await dynamodb.createTable({
      TableName: 'UserMaps',
      KeySchema: [{ AttributeName: 'uid', KeyType: 'HASH' },
        { AttributeName: 'mapId', KeyType: 'RANGE' }],
      AttributeDefinitions: [ { AttributeName: 'uid', AttributeType: 'S' },
        { AttributeName: 'mapId', AttributeType: 'S' }],
      BillingMode: 'PAY_PER_REQUEST'
    }).promise();
    console.log('UserMaps table created');
  } catch (err) {
    if (err.code === 'ResourceInUseException') {
      console.log('UserMaps table already exists');
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