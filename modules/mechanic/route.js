const {
  getMechanicInfo,
  getContactInfo,
  reviewMechanic,
} = require("./controller");

const Router = require("express").Router();

Router.get("/details/:id", getMechanicInfo);
Router.get("/contact-info/:id", getContactInfo);
Router.post("/rate", reviewMechanic);

module.exports = Router;
