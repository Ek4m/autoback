require("dotenv").config();

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const initDb = require("./conf/db/init");
const authRoutes = require("./modules/auth/route");

const server = express();
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
server.use(express.json());
server.use(cookieParser());
server.use("/auth", authRoutes);

server.listen(4000, () => {
  initDb().then(() => {
    console.log("DB connected");
    console.log("Listening");
  });
});
