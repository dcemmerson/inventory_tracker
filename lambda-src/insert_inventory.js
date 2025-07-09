import { insertItem } from "./db";

require("dotenv").config();

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async function (event, context) {
  const { user } = context.clientContext;

  if (!user || event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        msg: "Invalid submit method.",
      }),
    };
  }

  try {
    const data = JSON.parse(event.body)
    await insertItem(user, data);

    return {
      statusCode,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        msg: err.toString(),
      }),
    };
  }
};
