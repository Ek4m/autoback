// USER ↔ PROBLEM
User.hasMany(Problem, { foreignKey: "userId", as: "problems" });
Problem.belongsTo(User, { foreignKey: "userId", as: "user" });

// CATEGORY ↔ PROBLEM
Category.hasMany(Problem, { foreignKey: "categoryId", as: "problems" });
Problem.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// CATEGORY ↔ PARENT CATEGORY
Category.hasMany(Category, {
  foreignKey: "parentId",
  as: "subcategories",
});

Category.belongsTo(Category, {
  foreignKey: "parentId",
  as: "parent",
});

// USER ↔ SPECIALIST
User.hasOne(SpecialistInfo, { foreignKey: "userId", as: "specialistInfo" });
SpecialistInfo.belongsTo(User, { foreignKey: "userId", as: "user" });

// USER  ↔ OFFER
User.hasMany(Offer, { foreignKey: "userId", as: "offers" });
Offer.belongsTo(User, { foreignKey: "userId", as: "user" });

// OFFER  ↔ PROBLEM
Problem.hasMany(Offer, { foreignKey: "problemId", as: "offers" });
Offer.belongsTo(Problem, { foreignKey: "problemId", as: "problem" });

// USER ↔ SERVICES
User.hasMany(Service, { foreignKey: "userId", as: "services" });
Service.belongsTo(User, { foreignKey: "userId", as: "user" });

// OFFER_AGREEMENT ↔ OFFERS
Offer.hasOne(OfferAgreement, { foreignKey: "offerId", as: "offerAgreement" });
OfferAgreement.belongsTo(Offer, { foreignKey: "offerId", as: "offer" });

// OFFER_AGREEMENT ↔ ISSUES
Problem.hasOne(OfferAgreement, {
  foreignKey: "problemId",
  as: "offerAgreement",
});
OfferAgreement.belongsTo(Problem, { foreignKey: "problemId", as: "problem" });

// USER (customer) ↔ REVIEW
User.hasMany(MechanicReview, {
  foreignKey: "userId",
  as: "givenReviews",
});

MechanicReview.belongsTo(User, {
  foreignKey: "userId",
  as: "reviewer",
});

// MECHANIC ↔ REVIEW
User.hasMany(MechanicReview, {
  foreignKey: "mechanicId",
  as: "receivedReviews",
});

MechanicReview.belongsTo(User, {
  foreignKey: "mechanicId",
  as: "mechanic",
});

// PROBLEM ↔ REVIEW
Problem.hasOne(MechanicReview, {
  foreignKey: "problemId",
  as: "review",
});

MechanicReview.belongsTo(Problem, {
  foreignKey: "problemId",
  as: "problem",
});

// OFFER AGREEMENT ↔ REVIEW
OfferAgreement.hasOne(MechanicReview, {
  foreignKey: "offerAgreementId",
  as: "review",
});

MechanicReview.belongsTo(OfferAgreement, {
  foreignKey: "offerAgreementId",
  as: "offerAgreement",
});

// CAR MODEL ↔ CAR BRAND
CarBrand.hasMany(CarModel, {
  foreignKey: "brandId",
  as: "models",
});

CarModel.belongsTo(CarBrand, {
  foreignKey: "brandId",
  as: "brand",
});

// PROBLEM ↔ CAR BRAND
CarBrand.hasMany(Problem, {
  foreignKey: "brandId",
  as: "problems",
});

Problem.belongsTo(CarBrand, {
  foreignKey: "brandId",
  as: "brand",
});

// CAR MODEL ↔ PROBLEM
CarModel.hasMany(Problem, {
  foreignKey: "modelId",
  as: "problems",
});

Problem.belongsTo(CarModel, {
  foreignKey: "modelId",
  as: "model",
});
