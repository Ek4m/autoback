const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

class Problem extends Model {}

Problem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    minBudget: DataTypes.STRING,
    maxBudget: DataTypes.STRING,
    carYear: DataTypes.INTEGER,
    city: DataTypes.STRING,
    isVip: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "user_issues",
    timestamps: true,
  },
);

module.exports = Problem;
