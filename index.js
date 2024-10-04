const express = require("express");
const cors = require("cors");
const realtimeRoute = require("./routers/realtime");
const app = express();
const {listenNotification} = require("./helpers/psql")

listenNotification();

app.use(
  cors({
    origin: "*",
  })
);
app.options("*", cors());
app.use(express.json());

app.get("/", async (req, res) => {
  return res.json({ Message: "Hn hu bhai. Chal raha hu :)" });
});

app.use("/realtime", realtimeRoute);

app.listen(1337, () => {
  console.log("Listening on 1337");
});