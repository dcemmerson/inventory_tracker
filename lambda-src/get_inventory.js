import { getInventory, tallyInventory } from "./db";

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
    return {
      statusCode,
      headers,
      body: JSON.stringify(results),
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
