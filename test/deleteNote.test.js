'use strict';

const event = {
  version: '2.0',
  routeKey: 'DELETE /{note_name}',
  rawPath: '/Teste',
  rawQueryString: '',
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'content-length': '0',
    host: 'API_DOMAIN',
    'postman-token': '7ee76fdb-856c-474f-bf3c-559f09c6d5b9',
    'user-agent': 'PostmanRuntime/7.29.2',
    'x-amzn-trace-id': 'Root=1-639a8d0a-2b73320221aa88f256bb1e70',
    'x-forwarded-for': 'IP',
    'x-forwarded-port': '443',
    'x-forwarded-proto': 'https'
  },
  requestContext: {
    accountId: 'ID',
    apiId: 'API_ID',
    domainName: 'API_DOMAIN',
    domainPrefix: 'DOMAIN_PREFIX',
    http: {
      method: 'DELETE',
      path: '/Teste',
      protocol: 'HTTP/1.1',
      sourceIp: 'IP',
      userAgent: 'PostmanRuntime/7.29.2'
    },
    requestId: 'dKr5rg8MoAMEVCg=',
    routeKey: 'DELETE /{note_name}',
    stage: '$default',
    time: '15/Dec/2022:02:57:14 +0000',
    timeEpoch: 1671073034524
  },
  pathParameters: { note_name: 'teste' },
  isBase64Encoded: false
}


// tests for deleteNote
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('deleteNote', '/lambdas/deleteNote.js', 'handler');

const AWS = require("aws-sdk");
const AWS_SDK_MOCK = require("aws-sdk-mock");

describe('deleteNote tests', () => {
  before((done) => {
    AWS_SDK_MOCK.setSDKInstance(AWS);
    AWS_SDK_MOCK.mock("DynamoDB.DocumentClient", "delete", function (params, callback) {
      if (params.Key.note_name === 'exception_test') {
        callback({name: 'ConditionalCheckFailedException'}, null);
      } else if (params.Key.note_name === 'another_error') {
        callback({name: "ANY_ERROR"}, {});
      } else {
        callback(null, {});
      };
    });
    done();
  });
  after((done) => {
    AWS_SDK_MOCK.restore("DynamoDB");
    done();
  });

  it("Deleting note", async () => {
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(200);
  });

  it("Note dont exist", async () => {
    event.pathParameters.note_name = 'exception_test';
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(404);
  });

  it("Dynamodb not treated error", async () => {
    event.pathParameters.note_name = 'another_error';
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(500);
  });
});
