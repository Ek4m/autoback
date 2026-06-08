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
const offerRoutes = require("./modules/offer/route");
const buildRoutes = require("./modules/build/route");
const mechanicRoutes = require("./modules/mechanic/route");
const profileRoutes = require("./modules/profile/route");
const serviceRoutes = require("./modules/services/route");

const server = express();
server.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://autofix-one.vercel.app"
        : "http://localhost:3000",
    credentials: true,
  }),
);

server.use("/public", express.static(path.join(process.cwd(), "public")));
server.use(express.json());
server.use(cookieParser());
server.use("/auth", authRoutes);
server.use("/issues", issueRoutes);
server.use("/contact", contactRoutes);
server.use("/mechanic", mechanicRoutes);
server.use("/upload", checkAuth, uploadRoutes);
server.use("/offer", checkAuth, offerRoutes);
server.use("/profile", checkAuth, profileRoutes);
server.use("/build", buildRoutes);
server.use("/services", serviceRoutes);
server.use("/test", testRoutes);
server.use("/healthcheck", (req, res) => {
  res.json({ message: "Everything is fine!" });
});

initDb().then(() => {
  server.listen(process.env.PORT || 4000, () => {
    console.log("DB connected");
    console.log("Listening");
  });
});
