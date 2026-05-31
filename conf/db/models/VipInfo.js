import { EntityType } from "../../../modules/problems/constants";

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

export class VipInfo extends Model {}
VipInfo.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    expiresAt: DataTypes.DATEONLY,
    entityType: DataTypes.ENUM(EntityType.PROBLEM, EntityType.SERVICE),
    entityId: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "vip_infos",
    timestamps: true,
  },
);
