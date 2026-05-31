const { sendContactMessage } = require("./controller");

const Router = require("express").Router();

Router.post("/send", sendContactMessage);

module.exports = Router;
