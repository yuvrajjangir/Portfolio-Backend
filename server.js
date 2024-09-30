const express = require("express");
const cors = require("cors");
const { contactController } = require("./Routes/contact.routes");
const { viewsController } = require("./Routes/view.routes");
require("dotenv").config();
const connection = require("./Config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Done");
});

app.use("/", contactController);
app.use("/", viewsController);

const port = process.env.PORT;
app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  console.log(`Server running on port ${port}`);
});
