const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");
const { OFFER_STATUS } = require("../../../modules/problems/constants");

class Offer extends Model {}
Offer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: DataTypes.STRING(500),
    minHours: DataTypes.INTEGER,
    maxHours: DataTypes.INTEGER,
    minHoursUnit: DataTypes.INTEGER,
    status: { type: DataTypes.STRING, defaultValue: OFFER_STATUS.PENDING },
    maxHoursUnit: DataTypes.INTEGER,
    minPrice: DataTypes.INTEGER,
    maxPrice: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "offers",
    timestamps: true,
  },
);

module.exports = Offer;
