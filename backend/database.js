const AWS = require("aws-sdk");
const environment = process.env.APP_ENVIRONMENT || "local"; //local or prod

if (environment === "prod") {
  // prod Configuration
  AWS.config.update({
    region: process.env.DYNAMODB_REGION,
  });
} else {
  // local Configuration
  AWS.config.update({
    region: process.env.DYNAMODB_REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  });
}
AWS.config.logger = console;
console.log("Loaded ENV:", {
  APP_ENVIRONMENT: process.env.APP_ENVIRONMENT,
  DYNAMODB_REGION: process.env.DYNAMODB_REGION,
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT,
});

console.log("Using endpoint:", AWS.config.endpoint?.href || "default");
console.log("Region:", AWS.config.region);

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// Wait for DynamoDB function
const waitForDynamoDB = async () => {
  console.log("Waiting for DynamoDB to be ready...");
  let retries = 5;

  while (retries > 0) {
    try {
      await dynamodb.listTables().promise();
      console.log("DynamoDB is ready!");
      return true;
    } catch (err) {
      console.log(`Waiting for DynamoDB... (${retries} retries left)`);
      console.error("DynamoDB error:", err);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw new Error("DynamoDB failed to start");
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
  console.log("Initializing database tables...");

  await waitForDynamoDB();

  //   console.log('Deleting existing tables to recreate with proper EmailIndex...');
  //   await deleteTableIfExists('Users');
  //   await deleteTableIfExists('UserMaps');

  try {
    await dynamodb
      .createTable({
        TableName: "Users",
        KeySchema: [{ AttributeName: "uid", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "uid", AttributeType: "S" },
          { AttributeName: "email", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "EmailIndex",
            KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
            Projection: { ProjectionType: "ALL" },
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
      .promise();
    console.log("Users table created with autogennerated UID");
  } catch (err) {
    if (err.code === "ResourceInUseException") {
      console.log("Users table already exists");
    } else {
      console.error("Error creating Users table:", err);
    }
  }

  try {
    await dynamodb
      .createTable({
        TableName: "UserMaps",
        KeySchema: [
          { AttributeName: "uid", KeyType: "HASH" },
          { AttributeName: "mapId", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "uid", AttributeType: "S" },
          { AttributeName: "mapId", AttributeType: "S" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
      .promise();
    console.log("UserMaps table created");
  } catch (err) {
    if (err.code === "ResourceInUseException") {
      console.log("UserMaps table already exists");
    } else {
      console.error("Error creating UserStates table:", err);
    }
  }
}

module.exports = {
  dynamodb,
  docClient,
  initializeDatabase,
};
