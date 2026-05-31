const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

class MechanicReview extends Model {}
MechanicReview.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.TEXT("long"),
    },
    rating: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "mechanic_reviews",
    timestamps: true,
  },
);

module.exports = MechanicReview;
