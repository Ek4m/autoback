require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { checkAuth } = require("./modules/auth/middleware");

const initDb = require("./conf/db/init");
const authRoutes = require("./modules/auth/route");
const issueRoutes = require("./modules/problems/route");
const testRoutes = require("./modules/test/route");
const uploadRoutes = require("./modules/upload/route");
const contactRoutes = require("./modules/contact/route");

const server = express();
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

server.use("/public", express.static(path.join(process.cwd(), "public")));
server.use(express.json());
server.use(cookieParser());
server.use("/auth", authRoutes);
server.use("/issues", issueRoutes);
server.use("/contact", contactRoutes);
server.use("/upload", checkAuth, uploadRoutes);
server.use("/test", testRoutes);

server.listen(4000, () => {
  initDb().then(() => {
    console.log("DB connected");
    console.log("Listening");
  });
});
