const Router = require("express").Router();
const {
  completeProblem,
  cancelProblem,
  getUsersProblems,
  updatePassword,
  updateProfile,
} = require("./controller");

Router.put("/problems/:id/complete", completeProblem);
Router.delete("/problems/:id/cancel", cancelProblem);
Router.get("/problems", getUsersProblems);
Router.patch("/update-password", updatePassword);
Router.put("/edit", updateProfile);

module.exports = Router;
