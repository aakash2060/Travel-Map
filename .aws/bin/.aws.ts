#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StaticSiteStack } from "../lib/s3-bucket-site-stack";
import { DynamoDbStack } from "../lib/dynamo-table-stack";
import { BackendServiceStack } from "../lib/backend-service-stack";

import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = new cdk.App();
const S3_BUCKET = process.env.CDK_SITE_BUCKET;
if (!S3_BUCKET) {
  throw new Error(`Missing env value for CDK_SITE_BUCKET`);
}
new StaticSiteStack(app, "StaticSiteStack", {
  env: {
    region: "us-east-1", // or your preferred region
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  domainName: S3_BUCKET, // ← your subdomain
});

new DynamoDbStack(app, "DynamoDbStack", { env: { region: "us-east-1" } });

new BackendServiceStack(app, "BackendServiceStack", {
  env: {
    region: "us-east-1",
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  vpcId: process.env.CDK_VPC_ID!,
  certificateArn: process.env.CDK_API_CERT_ARN!,
  apiURL: process.env.CDK_API_URL!,
});
