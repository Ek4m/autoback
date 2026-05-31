const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

export class OfferAgreement extends Model {}
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
