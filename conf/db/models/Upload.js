const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

export class Upload extends Model {}
Upload.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    entityId: DataTypes.INTEGER,
    type: DataTypes.ENUM(EntityType.PROBLEM),
  },
  {
    sequelize,
    tableName: "uploads",
    timestamps: true,
  },
);
