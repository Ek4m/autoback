const sequelize = require("./config");

async function initDb() {
  try {
    await sequelize.authenticate();

    await sequelize.sync({
      alter: true,
    });

    console.log("Database connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = initDb;
