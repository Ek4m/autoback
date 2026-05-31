const { offer, approveOffer, cancelOffer } = require("./controller");
const { checkAuth } = require("../auth/middleware");
const Router = require("express").Router();

Router.post("/", checkAuth, offer);
Router.put("/:id/approve", checkAuth, approveOffer);
Router.put("/:id/cancel", checkAuth, cancelOffer);

module.exports = Router;
