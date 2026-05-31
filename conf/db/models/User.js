const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  },
);

module.exports = User;
