import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import "dotenv/config";

const SHEET_ID = "1xZ4_VnnvQJsboGaV92pNLsZfl6dUk7WCssr2uYkkpuU";

export async function getSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: "v4", auth: authClient });
}

export function getTabName(user) {
  return `Sheet_${user.email.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 90)}`;
}

export async function createTabIfNotExists(sheets, tabName) {
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  const exists = metadata.data.sheets.some(
    (sheet) => sheet.properties.title === tabName
  );

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: tabName,
              },
            },
          },
        ],
      },
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${tabName}!A1:E1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["id", "name", "quantity", "burnRate", "lastModified"]],
      },
    });
  }
}

export async function getInventory(user) {
  const sheets = await getSheetsClient();

  const sheetName = getTabName(user);
  await createTabIfNotExists(sheets, sheetName);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A2:E`, // skip header row
  });

  const rows = res.data.values || [];

  // Convert rows to objects
  const data = rows.map((row) => ({
    data: {
      id: row[0],
      name: row[1],
      quantity: Number(row[2]),
      burnRate: Number(row[3]),
      lastModified: Number(row[4]),
    },
  }));

  return { data };
}

export async function insertItem(user, item, currentTimestamp) {
  const sheets = await getSheetsClient();

  const tabName = getTabName(user);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A:E`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [item.id, item.name, item.quantity, item.burnRate, currentTimestamp],
      ],
    },
  });
}

export async function updateEntireSheet(user, inventory, currentTimestamp) {
  const tabName = getTabName(user);
  const sheets = await getSheetsClient();

  // Prepare headers + rows
  const values = [
    ["id", "name", "quantity", "burnRate", "lastModified"],
    ...inventory.map((item) => [
      item.data.id,
      item.data.name,
      item.data.quantity,
      item.data.burnRate,
      item.data.lastModified || currentTimestamp,
    ]),
  ];

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A1:Z1000`,
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A1:E`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });
}

export async function tallyInventory(user, inventory) {
  const currentTimestamp = Math.round(new Date().getTime() / 1000);

  inventory.data = inventory.data.map((item) => {
    item.data = consumeSupplies({ ...item.data }, currentTimestamp);
    return item;
  });

  const mustUpdate = inventory.data.some((item) => item.mustUpdate);
  if (!mustUpdate) {
    return inventory;
  }

  await updateEntireSheet(user, inventory.data, currentTimestamp);

  return inventory;
}

function consumeSupplies(data, currentTimestamp) {
  const SECONDS_PER_DAY = 60 * 60 * 24;
  const daysToSubtract = Math.trunc(
    (currentTimestamp - data.lastModified) / SECONDS_PER_DAY
  );

  if (daysToSubtract > 0 && data.quantity > 0) {
    data.lastModified += SECONDS_PER_DAY * daysToSubtract;
    data.quantity -= data.burnRate * daysToSubtract;
    data.mustUpdate = true;
  }

  if (data.quantity < 0) {
    data.quantity = 0;
  }
  return data;
}
