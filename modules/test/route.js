const { loadCategories } = require("./controller");

const Router = require("express").Router();

Router.get("/cat", loadCategories);

module.exports = Router;
