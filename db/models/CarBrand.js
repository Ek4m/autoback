const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

class CarBrand extends Model {}

CarBrand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    isPopular: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    tableName: "car_brands",
    timestamps: true,
  },
);

module.exports = CarBrand;
