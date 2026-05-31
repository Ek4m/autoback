const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

export class ContactMessage extends Model {}
ContactMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    reason: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT("medium"),
  },
  {
    sequelize,
    tableName: "contact_messages",
    timestamps: true,
  },
);
