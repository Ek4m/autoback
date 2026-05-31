const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

class CarModel extends Model {}

CarModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    brandId: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "car_models",
    timestamps: true,
  },
);

module.exports = CarModel;
