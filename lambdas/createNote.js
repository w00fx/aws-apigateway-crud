"use strict";
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const validateData = (eventBody) => {
  return (
    typeof eventBody.note_name === "string" &&
    typeof eventBody.note_description === "string"
  );
};

exports.handler = async (event) => {
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
            note_name: eventBody.note_name,
            note_description: eventBody.note_description,
          },
          ConditionExpression: "attribute_not_exists(note_name)",
        };
        await dynamoDb.put(putParams).promise();
        statusCode = 201;
        body = `Note "${eventBody.note_name}" inserted in table.`;
      } catch (err) {
        if (err.name === "ConditionalCheckFailedException") {
          console.log(`Note "${eventBody.note_name}" already exists in table.`);
          statusCode = 400;
          body = `Note "${eventBody.note_name}" already exists in table.`;
        } else {
          console.log(`Error has happened: "${err}"`);
          statusCode = 500;
          body = "Error has happened.";
        }
      }
    } else {
      statusCode = 400;
      body =
        "Body is invalid. note_name and note_description should be strings.";
      console.log(
        "Body is invalid. note_name and note_description should be strings."
      );
    }
  } else {
    statusCode = 400;
    body = "Body is invalid. Please insert note_name and note_description.";
    console.log(
      "Body is invalid. Please insert note_name and note_description."
    );
  }

  return {
    statusCode,
    body,
  };
};
