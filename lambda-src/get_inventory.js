import { getInventory, tallyInventory } from "./db";

require("dotenv").config();

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async function (event, context) {
  const { user } = context.clientContext;

  let results;

  if (!user) {
    return {
      statusCode,
      headers,
      body: JSON.stringify({
        msg: "not logged in",
        loggedIn: false,
        context: context,
      }),
    };
  }

  try {
    results = await tallyInventory(user, await getInventory(user));
  } catch (err) {
    results = err;
  } finally {
    return {
      statusCode,
      headers,
      body: JSON.stringify(results),
    };
  }
};

