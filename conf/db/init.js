const seed = require("../../seed");
const sequelize = require("./config");

async function initDb() {
  try {
    await sequelize.authenticate();

    await sequelize.sync({
      alter: true,
    });
    await seed();
    console.log("Database connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = initDb;
