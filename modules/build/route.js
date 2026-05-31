const { getCategories, getBrandsAndModels } = require("./controller");
const Router = require("express").Router();

Router.get("/categories", getCategories);
Router.get("/brands-and-models", getBrandsAndModels);

module.exports = Router;
