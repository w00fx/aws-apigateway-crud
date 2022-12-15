"use strict";
const AWS = require("aws-sdk");

const validateData = (eventBody) => {
  return (
    typeof eventBody.note_name === "string" &&
    typeof eventBody.note_description === "string"
  );
};

exports.handler = async (event) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  try {
    JSON.parse(event.body);
  } catch (err) {
    console.log(`Invalid JSON format. Error: "${err}"`);
    return {
      statusCode: 400,
      body: "Invalid JSON format.",
    };
  }

  let body;
  let statusCode;
  const eventBody = JSON.parse(event.body);

  if (eventBody.note_name && eventBody.note_description) {
    if (validateData(eventBody)) {
      try {
        const putParams = {
          TableName: process.env.TABLE_NAME,
          Item: {
            note_name: eventBody.note_name.toLowerCase(),
            note_description: eventBody.note_description,
          },
          ConditionExpression: "attribute_not_exists(note_name)",
        };
        await dynamoDb.put(putParams).promise();
        statusCode = 201;
        body = `Note "${eventBody.note_name}" inserted in table.`;
        console.log(body);
      } catch (err) {
        if (err.name === "ConditionalCheckFailedException") {
          statusCode = 409;
          body = `Note "${eventBody.note_name}" already exists in table.`;
          console.log(body);
        } else {
          statusCode = 500;
          body = "Can't access tables.";
          console.log(`Error has happened: "${err}"`);
        }
      }
    } else {
      statusCode = 400;
      body =
        "Body is invalid. note_name and note_description should be strings.";
      console.log(body);
    }
  } else {
    statusCode = 400;
    body = "Body is invalid. Please insert note_name and note_description.";
    console.log(body);
  }

  return {
    statusCode,
    body,
  };
};
