const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("./config/mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Working fine");
});
app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
