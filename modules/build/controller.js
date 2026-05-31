const { Op } = require("sequelize");
const { Category, CarBrand, CarModel } = require("../../conf/db/models");

const getCategories = async (req, res) => {
  const parentCategories = await Category.findAll({
    where: {
      parentId: {
        [Op.eq]: null,
      },
    },
    include: [{ model: Category, as: "subcategories" }],
  });
  res.json({ data: parentCategories });
};

const getBrandsAndModels = async (req, res) => {
  const response = await CarBrand.findAll({
    order: [["name", "ASC"]],
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: CarModel,
        as: "models",
        attributes: { exclude: ["createdAt", "updatedAt", "brandId"] },
      },
    ],
  });
  res.json({ data: response });
};

module.exports = { getCategories, getBrandsAndModels };
