const {
  getProblems,
  createProblem,
  getProblemInfo,
  getProblemEntities,
} = require("./controller");
const { checkAuth } = require("../auth/middleware");
const Router = require("express").Router();

Router.get("/list", getProblems);
Router.post("/post", checkAuth, createProblem);
Router.get("/:id", getProblemInfo);
Router.get("/:id/entities", getProblemEntities);

module.exports = Router;
