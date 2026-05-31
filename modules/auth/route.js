const { login, register, logout, getMe } = require("./controller");
const { checkAuth } = require("./middleware");

const Router = require("express").Router();

Router.post("/login", login);
Router.post("/register", register);
Router.post("/logout", logout);
Router.get("/info", checkAuth, getMe);

module.exports = Router;
