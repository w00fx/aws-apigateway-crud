'use strict';

// tests for updateNote
// Generated by serverless-mocha-plugin

const event = {
  version: '2.0',
  routeKey: 'PUT /',
  rawPath: '/',
  rawQueryString: '',
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'content-length': '80',
    'content-type': 'application/json',
    host: 'API_DOMAIN',
    'postman-token': 'e0438476-885b-411d-9bf4-1613ee4a7c4d',
    'user-agent': 'PostmanRuntime/7.29.2',
    'x-amzn-trace-id': 'Root=1-639a990f-4d6db200033a1c1553f5a064',
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
      method: 'PUT',
      path: '/',
      protocol: 'HTTP/1.1',
      sourceIp: '177.157.87.250',
      userAgent: 'PostmanRuntime/7.29.2'
    },
    requestId: 'dKzagiegIAMEJhA=',
    routeKey: 'PUT /',
    stage: '$default',
    time: '15/Dec/2022:03:48:31 +0000',
    timeEpoch: 1671076111815
  },
  body: '{\n' +
    '    "note_name": "Test",\n' +
    '    "note_description": "This is a note for Mocha"\n' +
    '}',
  isBase64Encoded: false
}


const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('updateNote', '/lambdas/updateNote.js', 'handler');

const AWS = require("aws-sdk");
const AWS_SDK_MOCK = require("aws-sdk-mock");

describe('updateNote tests', () => {
  before((done) => {
    AWS_SDK_MOCK.setSDKInstance(AWS);
    AWS_SDK_MOCK.mock("DynamoDB.DocumentClient", "update", function (params, callback) {
      console.log(params);
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

  it("normal update test", async () => {
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(201);
  });

  it("Note do not exists", async () => {
    event.body = '{\n' +
    '    "note_name": "exception_test",\n' +
    '    "note_description": "This is a note for Mocha"\n' +
    '}'
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(404);
  });

  it("Dynamodb not treated error", async () => {
    event.body = '{\n' +
    '    "note_name": "another_error",\n' +
    '    "note_description": "This is a note for Mocha"\n' +
    '}'
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(500);
  });

  it("Invalid JSON format", async () => {
    event.body = 'invalid json';
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(400);
  });

  it("Missing necessary fields", async () => {
    event.body = '{\n    "invalid_field": "test"\n    }';
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(400);
  });

  it("Fields must be strings", async () => {
    event.body = '{\n    "note_name": "Test",\n    "note_description": 1234\n}';
    const response = await wrapped.run(event);
    expect(response).to.have.property("statusCode").equal(400);
  });
});
