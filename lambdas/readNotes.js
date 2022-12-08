"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
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
    console.log(err);
  }

  statusCode = 200;
  body = JSON.stringify({
    notes: result.Items,
    message: "Items retrieved."
  });
  console.log(result);

  return {
    statusCode,
    body,
  };
};
