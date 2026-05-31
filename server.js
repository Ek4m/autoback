require("dotenv").config();

const express = require("express");
const initDb = require("./db/init");

const server = express();

server.listen(3000, () => {
  initDb().then(() => {
    console.log("DB connected");
    console.log("Listening");
  });
});
