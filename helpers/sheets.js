require("dotenv").config();
const { google } = require("googleapis");

async function updateGoogleSheet({ rows: data, count }) {
  const sheets = google.sheets({ version: "v4", auth: await authenticate() });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  await sheets.spreadsheets.values
    .clear({
      spreadsheetId,
      range: "Database",
    })
    .then((response) => {
      console.log("Sheet cleared successfully:", response.data);
    })
    .catch((err) => {
      console.error("Error clearing Google Sheet:", err);
    });

  const headers = Object.keys(data[0]);
  let newData = [...data.map((row) => headers.map((header) => row[header]))];
  newData = [headers.map((header) => header), ...newData];

  await sheets.spreadsheets.values
    .update({
      spreadsheetId,
      range: "Database!A1",
      valueInputOption: "RAW",
      resource: {
        values: newData,
      },
    })
    .then((response) => {
      console.log("Data updated successfully:", response.data);
    })
    .catch((err) => {
      console.error("Error updating Google Sheet:", err);
    });

  const countData = [
    ["Count", count],
    [
      "Last Updated",
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
      }),
    ],
    ["Status"]
  ];

  await sheets.spreadsheets.values
    .update({
      spreadsheetId,
      range: "Metadata!A1",
      valueInputOption: "RAW",
      resource: {
        values: countData,
      },
    })
    .then((response) => {
      console.log(
        "Count data updated in Metadata successfully:",
        response.data
      );
    })
    .catch((err) => {
      console.error("Error updating Count data in Metadata:", err);
    });
}

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./lib/credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return await auth.getClient();
}

module.exports = {
  updateGoogleSheet,
  authenticate,
};
