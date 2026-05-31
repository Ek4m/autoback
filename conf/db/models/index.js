require("../associations");

const User = require("./User");
const Problem = require("./Problem");
const Category = require("./Category");
const CarBrand = require("./CarBrand");
const CarModel = require("./CarModel");

const ContactMessage = require("./ContactMessage");
const MechanicReview = require("./MechanicReview");
const Offer = require("./Offer");
const OfferAgreement = require("./OfferAgreement");
const Service = require("./Service");

const SpecialistInfo = require("./SpecialistInfo");
const Upload = require("./Upload");
const VipInfo = require("./VipInfo");

module.exports = {
  User,
  Problem,
  Category,
  CarBrand,
  CarModel,
  ContactMessage,
  Offer,
  OfferAgreement,
  Service,
  SpecialistInfo,
  Upload,
  VipInfo,
};
