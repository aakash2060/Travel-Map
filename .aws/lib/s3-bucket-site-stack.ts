import * as cdk from "aws-cdk-lib";
import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export class StaticSiteStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & { domainName: string }
  ) {
    super(scope, id, props);

    const CERT_ARN = process.env.CDK_CERT_ARN;
    if (!CERT_ARN) {
      throw new Error(`Missing env value for CDK_CERT_ARN`);
    }
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: props.domainName, // e.g. "app.example.com"
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.RETAIN, // keep data if stack is destroyed
    });

    // Create Origin Access Control (OAC)
    const oac = new cloudfront.CfnOriginAccessControl(this, "OAC", {
      originAccessControlConfig: {
        name: `${props.domainName}-oac`,
        originAccessControlOriginType: "s3",
        signingBehavior: "always",
        signingProtocol: "sigv4",
        description: "OAC for CloudFront to access S3",
      },
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultRootObject: "index.html",
      domainNames: [props.domainName],
      certificate: acm.Certificate.fromCertificateArn(
        this,
        "SSLCertificate",
        CERT_ARN
      ),
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
    });

    // Grant S3 permissions to CloudFront OAC
    const bucketPolicy = siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
          },
        },
      })
    );

    // Manually attach OAC to the origin in distribution
    const cfnDistribution = distribution.node
      .defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride(
      "DistributionConfig.Origins.0.OriginAccessControlId",
      oac.getAtt("Id")
    );

    // Output for use elsewhere
    new cdk.CfnOutput(this, "SiteBucketName", {
      value: siteBucket.bucketName,
    });
  }
}
