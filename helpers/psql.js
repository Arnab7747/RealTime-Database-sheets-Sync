require("dotenv").config();
const { Client } = require("pg");
const { updateGoogleSheet } = require("./sheets");

const client = new Client({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
});

const listenNotification = () => {
  client.connect();

  client.query("LISTEN table_changes", (err) => {
    if (err) {
      console.error("Error listening to notifications:", err.stack);
    } else {
      console.log("Listening for table changes...");
    }
  });

  client.on("notification", async (msg) => {
    console.log("Change detected!", msg);

    if (msg.channel === "table_changes") {
      const updatedData = await getUpdatedData();
      await updateGoogleSheet(updatedData);
    }
  });
};

async function getUpdatedData() {
  const res = await client.query("SELECT * FROM placement ORDER BY ID ASC");
  console.log("res : ", res);
  return { rows: res.rows, count: res.rowCount };
}

const checkIfRecordExists = async (newData) => {
  const primaryKey = process.env.PSQL_TABLE_PRIMARY_KEY;
  const primaryKeyValue = newData[primaryKey];

  try {
    const query = `SELECT ${primaryKey} FROM ${process.env.PSQL_TABLE} WHERE ${primaryKey} = $1`;
    const result = await client.query(query, [primaryKeyValue]);

    return result.rowCount > 0;
  } catch (error) {
    console.error("Error checking record existence:", error);
    throw error;
  }
};

const updateRecord = async (newData) => {
  try {
    const primaryKey = process.env.PSQL_TABLE_PRIMARY_KEY;
    const primaryKeyValue = newData[primaryKey];
    const columns = Object.keys(newData).filter((col) => col !== primaryKey);

    const setClause = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");

    const query = `
        UPDATE ${process.env.PSQL_TABLE}
        SET ${setClause}
        WHERE ${primaryKey} = $${columns.length + 1};
      `;

    console.log("Query : ", query);

    const values = columns.map((col) => newData[col]);
    values.push(primaryKeyValue);

    await client.query(query, values);

    console.log("Record updated successfully:", primaryKeyValue);
    return true;
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

const addRecord = async (newData) => {
  try {
    const primaryKey = process.env.PSQL_TABLE_PRIMARY_KEY;
    const primaryKeyValue = newData[primaryKey];
    const exists =
      primaryKeyValue === "" ? false : await checkIfRecordExists(newData);

    if (exists) {
      console.log("Record exists, updating...");
      return await updateRecord(newData);
    } else {
      const columns = Object.keys(newData).filter((col) => col !== primaryKey);
      const columnNames = columns.join(", ");
      const placeholders = columns
        .map((_, index) => `$${index + 1}`)
        .join(", ");
      const values = columns.map((col) => newData[col]);

      const query = `
          INSERT INTO ${process.env.PSQL_TABLE} (${columnNames})
          VALUES (${placeholders});
        `;

      console.log("Insert Query: ", query);

      await client.query(query, values);

      console.log("Record added successfully:", primaryKeyValue);
      return true;
    }
  } catch (error) {
    console.error("Error adding record:", error);
    throw error;
  }
};

const deleteRecord = async (ids) => {
    try {
        const primaryKey = process.env.PSQL_TABLE_PRIMARY_KEY;
    
        const query = `
          DELETE FROM ${process.env.PSQL_TABLE}
          WHERE ${primaryKey} NOT IN (${ids.map((_, index) => `$${index + 1}`).join(", ")});
        `;
    
        console.log("Query: ", query);
    
        await client.query(query, ids);
    
        console.log("Records deleted that where not in the provided ids:", ids);
        return true;
      } catch (error) {
        console.error("Error deleting records:", error);
        throw error;
      }
};

module.exports = {
  client,
  listenNotification,
  getUpdatedData,
  updateRecord,
  addRecord,
  deleteRecord,
};
