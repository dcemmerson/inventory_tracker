import { getInventory, tallyInventory, updateEntireSheet } from "./db";

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async function (event, context) {
  const { user } = context.clientContext;

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

  const currentTimestamp = Math.round(new Date().getTime() / 1000);
  const inventory = JSON.parse(event.body);

  try {
    await updateEntireSheet(user, inventory, currentTimestamp);

    const inventoryDb = await tallyInventory(user, await getInventory(user));
    return {
      statusCode,
      headers,
      body: JSON.stringify(inventoryDb),
    };
  } catch (err) {
    return {
      success: false,
      loggedIn: true,
      body: JSON.stringify({
        success: false,
        msg: err.toString(),
      }),
    };
  }
};
