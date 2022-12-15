"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event) => {

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  let statusCode;
  let body;

  const note_name = event.pathParameters.note_name.toLowerCase();


  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        note_name: note_name,
      },
      ConditionExpression: "attribute_exists(note_name)"
    };
    await dynamoDb.delete(params).promise();
    statusCode = 200;
    body = `Note "${note_name}" deleted.`;
    console.log(body);
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      statusCode = 404;
      body = `Note "${note_name}" do not exist.`
      console.log(body)
    } else {
      statusCode = 500;
      body = "Cant accessed tables.";
      console.log(`"${body} Error": "${err}"`);
    };
  };

  return {
    statusCode,
    body,
  };
};
