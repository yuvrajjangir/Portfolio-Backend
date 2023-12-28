const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRouter = require("./Routes/contact.routes");
require("dotenv").config();
const connection = require("./Config/db");


const app = express();


app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Done");
})


app.use("/", contactRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async() => {
    try {
        await connection
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
  console.log(`Server running on port ${PORT}`);
});
