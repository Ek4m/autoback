const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

class OfferAgreement extends Model {}
OfferAgreement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "offer_agreements",
    timestamps: true,
  },
);
module.exports = OfferAgreement;
