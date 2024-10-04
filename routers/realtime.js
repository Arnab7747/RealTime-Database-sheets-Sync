const router = require("express").Router();
require("dotenv").config();
const { isAuthorized } = require("../middleware/dataAdminAuth");
const {
  updateRecord,
  addRecord,
  deleteRecord,
  getUpdatedData,
} = require("../helpers/psql");
const { updateGoogleSheet } = require("../helpers/sheets");

router.post("/", isAuthorized, async (req, res) => {
  const data = req.body;
  console.log("request", data);

  try {
    if (data.action == "update") {
      await updateRecord(data.newData);
    } else if (data.action == "add") {
      await addRecord(data.newData);
    } else if (data.action == "delete") {
      await deleteRecord(data.ids);
    }

    return res.json("done");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  } finally {
    console.log(
      "Current Date and Time:",
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
      })
    );
  }
});

router.get("/", async (req, res) => {
  try {
    const updatedData = await getUpdatedData();
    await updateGoogleSheet(updatedData);

    return res.json("done");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  } finally {
    console.log(
      "Current Date and Time:",
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
      })
    );
  }
});

module.exports = router;
