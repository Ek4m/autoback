const {
  getServices,
  createService,
  getServiceById,
  toggleServiceStatus,
} = require("./controller");
const { checkAuth } = require("../auth/middleware");
const Router = require("express").Router();

Router.get("/list", getServices);
Router.post("/post", checkAuth, createService);
Router.get("/details/:id", getServiceById);
Router.patch("/toggle-activation/:id", checkAuth, toggleServiceStatus);
module.exports = Router;
