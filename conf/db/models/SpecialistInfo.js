const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

class SpecialistInfo extends Model {}
SpecialistInfo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    profession: DataTypes.JSONB,
    experienceYears: DataTypes.INTEGER,
    bio: DataTypes.TEXT("long"),
    locationUrl: DataTypes.STRING,
    rawAddress: DataTypes.STRING,
    objectName: DataTypes.STRING,
    city: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "specialist_info",
    timestamps: true,
  },
);

module.exports = SpecialistInfo;
