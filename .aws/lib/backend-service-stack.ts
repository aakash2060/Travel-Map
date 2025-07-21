import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";

interface BackendServiceStackProps extends cdk.StackProps {
  vpcId: string;
  certificateArn: string;
  apiURL: string;
}

export class BackendServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendServiceStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "Vpc", {
      vpcId: props.vpcId,
    });

    const repo = new ecr.Repository(this, "BackendRepo", {
      repositoryName: "backend-api",
      imageScanOnPush: true,
    });

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "BackendCert",
      props.certificateArn
    );

    const cluster = new ecs.Cluster(this, "BackendCluster", {
      vpc,
    });
    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: "anup-g.com",
    });

    const fargate_cluster =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "BackendFargateService",
        {
          cluster,
          cpu: 256,
          memoryLimitMiB: 512,
          desiredCount: 1,
          publicLoadBalancer: true,
          domainName: props.apiURL,
          domainZone: zone, // Optional if using external DNS
          certificate: certificate,
          assignPublicIp: true,
          taskSubnets: { subnetType: ec2.SubnetType.PUBLIC },
          taskImageOptions: {
            image: ecs.ContainerImage.fromEcrRepository(repo),
            containerPort: 8001, // Or whatever your Express app uses
            environment: {
              NODE_ENV: "production",
              // Add more env vars if needed
            },
          },
        }
      );
  }
}
