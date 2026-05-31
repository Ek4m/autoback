const Router = require("express").Router();
const {
  completeProblem,
  cancelProblem,
  getUsersProblems,
  updatePassword,
  updateProfile,
  becomeMechanic,
  getMechanicRatings,
  getPanelInfo,
  getMechanicOffers,
  deleteOffer,
} = require("./controller");

Router.put("/problems/:id/complete", completeProblem);
Router.delete("/problems/:id/cancel", cancelProblem);
Router.get("/problems", getUsersProblems);
Router.patch("/update-password", updatePassword);
Router.put("/edit", updateProfile);
Router.post("/mechanic/become-one", becomeMechanic);
Router.get("/mechanic/ratings", getMechanicRatings);
Router.get("/mechanic/panel-info", getPanelInfo);
Router.get("/mechanic/offers", getMechanicOffers);
Router.get("/mechanic/offers/:id", deleteOffer);

module.exports = Router;
