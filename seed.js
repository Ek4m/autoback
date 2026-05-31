const fs = require("fs");
const path = require("path");
const { Category, CarBrand, CarModel } = require("./conf/db/models");

async function seedCategories() {
  try {
    const count = await Category.count();
    if (count > 0) {
      console.log("Categories already exist. Skipping seed.");
      return;
    }

    console.log("Seeding categories...");

    const filePath = path.join(__dirname, "../data/brands.json");
    const categories = JSON.parse(fs.readFileSync(filePath, "utf8"));

    for (const category of categories) {
      const existingParent = await Category.findOne({
        where: { name: category.name, parentId: null },
      });

      let parent = existingParent;

      if (!parent) {
        parent = await Category.create({
          name: category.name,
          parentId: null,
        });
      }

      // 4. Insert subcategories
      if (Array.isArray(category.subcategories)) {
        for (const sub of category.subcategories) {
          const existingSub = await Category.findOne({
            where: {
              name: sub.name,
              parentId: parent.id,
            },
          });

          if (!existingSub) {
            await Category.create({
              name: sub.name,
              parentId: parent.id,
            });
          }
        }
      }
    }

    console.log("Categories seeded successfully");
    return;
  } catch (err) {
    console.error("Seeding failed:", err);
    return;
  }
}

async function seedCarBrands() {
  try {
    const brandCount = await CarBrand.count();

    if (brandCount > 0) {
      console.log("Car brands already exist. Skipping seed.");
      return;
    }

    console.log("Seeding car brands & models...");

    // 2. Load JSON
    const filePath = path.join(__dirname, "../data/brands.json");
    const brands = JSON.parse(fs.readFileSync(filePath, "utf8"));

    for (const brand of brands) {
      // 3. Create or find brand
      let dbBrand = await CarBrand.findOne({
        where: { name: brand.name },
      });

      if (!dbBrand) {
        dbBrand = await CarBrand.create({
          name: brand.name,
          isPopular: brand.isPopular || false,
        });
      }

      // 4. Insert models
      if (Array.isArray(brand.models)) {
        for (const model of brand.models) {
          const existingModel = await CarModel.findOne({
            where: {
              name: model.name,
              brandId: dbBrand.id,
            },
          });

          if (!existingModel) {
            await CarModel.create({
              name: model.name,
              brandId: dbBrand.id,
            });
          }
        }
      }
    }

    console.log("Car brands & models seeded successfully");
    return;
  } catch (err) {
    console.error("Seeding failed:", err);
    return;
  }
}

module.exports = async function () {
  await seedCategories();
  await seedCarBrands();
  return;
};
