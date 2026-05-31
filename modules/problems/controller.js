const { Op, fn, col } = require("sequelize");
const {
  ORDER_BY_CREATION,
  PROBLEM_STATUS,
  EntityType,
} = require("./constants");
const {
  Problem,
  User,
  Category,
  CarModel,
  CarBrand,
  VipInfo,
  SpecialistInfo,
  Offer,
  Upload,
} = require("../../conf/db/models");
const MechanicReview = require("../../conf/db/models/MechanicReview");

const getProblems = async (req, res) => {
  try {
    const category = Number(req.query.category);
    const city = req.query.city;
    const isVip = Boolean(Number(req.query.vip));
    const search = req.query.search;
    const order = req.query.order || ORDER_BY_CREATION.DESC;

    const where = {
      status: PROBLEM_STATUS.OPEN,
    };

    if (!isNaN(category) && category) {
      where.categoryId = category;
    }

    if (isVip) {
      where.isVip = true;
    }
    if (search)
      where.title = {
        [Op.iLike]: `%${search}%`,
      };

    if (city) {
      where.city = city;
    }

    const problems = await Problem.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password", "phoneNumber", "email", "role"],
          },
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: CarBrand,
          as: "brand",
          attributes: ["id", "name"],
        },
        {
          model: CarModel,
          as: "model",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["isVip", "DESC"],
        ["createdAt", order],
      ],
    });

    return res.status(200).json({
      data: problems,
    });
  } catch (error) {
    console.error("Get problems error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const createProblem = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const body = req.body;
    const prob = await Problem.create({
      ...body,
      userId: user?.id,
      status: PROBLEM_STATUS.OPEN,
    });

    // VIP logic
    if (body.isVip) {
      const now = new Date();
      const expireTimeInMs = 7 * 24 * 3600 * 1000;

      now.setTime(now.getTime() + expireTimeInMs);

      await VipInfo.create({
        expiresAt: now,
        entityId: prob.id,
        entityType: EntityType.PROBLEM,
      });
    }

    return res.status(201).json({
      data: prob,
    });
  } catch (error) {
    console.error("Create problem error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getProblemInfo = async (req, res) => {
  console.log("___________________________________________");
  try {
    const { id } = req.params;

    const problem = await Problem.findByPk(id, {
      include: [
        { model: User, as: "user" },
        { model: CarBrand, as: "brand", attributes: ["id", "name"] },
        { model: CarModel, as: "model", attributes: ["id", "name"] },
      ],
    });
    return res.json({
      data: problem,
    });
  } catch (error) {
    console.error("GET problem error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

const getProblemEntities = async (req, res) => {
  try {
    const { id } = req.params;
    const images = await Upload.findAll({
      where: {
        entityId: id,
        type: EntityType.PROBLEM,
      },
    });
    const offers = await Offer.findAll({
      where: {
        problemId: id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password", "phoneNumber", "email"],
            include: [
              [
                fn(
                  "COALESCE",
                  fn("ROUND", fn("AVG", col("user.receivedReviews.rating")), 1),
                  0,
                ),
                "avgRating",
              ],
              [fn("COUNT", col("user.receivedReviews.id")), "reviewsCount"],
            ],
          },
          include: [
            {
              model: SpecialistInfo,
              as: "specialistInfo",
              attributes: ["id", "objectName"],
            },
            {
              model: MechanicReview,
              as: "receivedReviews",
              attributes: [],
            },
          ],
        },
      ],
      group: ["Offer.id", "user.id", "user->specialistInfo.id"],
    });

    return res.json({
      data: {
        offers,
        images,
      },
    });
  } catch (error) {
    console.error("GET problem details error:", error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  getProblems,
  createProblem,
  getProblemInfo,
  getProblemEntities,
};
