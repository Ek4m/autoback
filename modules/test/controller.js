const { Category, CarBrand, CarModel } = require("../../conf/db/models");

const loadCategories = async (req, res) => {
  res.json(true);
};

module.exports = { loadCategories };
