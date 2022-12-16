"use strict";
const AWS = require("aws-sdk");

exports.handler = async () => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  let statusCode;
  let body;
  let result;

  try {
    const params = {
      TableName: process.env.TABLE_NAME,
    };
    result = await dynamoDb.scan(params).promise();
  } catch (err) {
    statusCode = 500;
    body = "Cant accessed tables.";
    console.log(`Cant accessed tables. Err: "${err}"`);
    return {
      statusCode,
      body,
    };
  }

  statusCode = 200;
  body = JSON.stringify({
    notes: result.Items,
    message: "Items retrieved."
  });
  console.log('Items retrieved.')

  return {
    statusCode,
    body,
  };
};
