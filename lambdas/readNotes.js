"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let statusCode;
  let body;

  try {
    const params = {
      TableName: process.env.TABLE_NAME,
    };
    var result = await dynamoDb.scan(params).promise();
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
