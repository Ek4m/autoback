const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

export class Service extends Model {}
Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    serviceName: DataTypes.STRING,
    description: DataTypes.TEXT,
    isActive: { type: DataTypes.BOOLEAN },
    priceMin: DataTypes.INTEGER,
    priceMax: DataTypes.INTEGER,
    isVip: DataTypes.BOOLEAN,
    categories: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "mechanic_services",
    timestamps: true,
  },
);
