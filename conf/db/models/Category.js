const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "categories",
    timestamps: true,
  },
);

module.exports = Category;
