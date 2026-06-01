const {
  getMechanicInfo,
  getContactInfo,
  reviewMechanic,
  getAllMechanics,
} = require("./controller");
const { checkAuth } = require("../auth/middleware");

const Router = require("express").Router();

Router.get("/", getAllMechanics);
Router.get("/details/:id", getMechanicInfo);
Router.get("/contact-info/:id", checkAuth, getContactInfo);
Router.post("/rate", checkAuth, reviewMechanic);

module.exports = Router;
