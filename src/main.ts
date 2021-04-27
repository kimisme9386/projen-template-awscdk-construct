import * as cdk from '@aws-cdk/core';

interface HelloWorldProps {}

export class HelloWorld extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: HelloWorldProps) {
    super(scope, id);
  }
}
