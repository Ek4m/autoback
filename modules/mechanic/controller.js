const { fn, col, literal } = require("sequelize");
const {
  User,
  SpecialistInfo,
  MechanicReview,
  OfferAgreement,
  Problem,
  Offer,
} = require("../../conf/db/models");
const { PROBLEM_STATUS } = require("../problems/constants");

const getMechanicInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: SpecialistInfo,
          as: "specialistInfo",
          attributes: { exclude: ["rawAddress", "locationUrl"] },
        },
      ],
      attributes: { exclude: ["password", "phoneNumber", "email", "role"] },
    });

    const reviewsStats = await MechanicReview.findOne({
      where: {
        mechanicId: id,
      },
      attributes: [
        [
          fn("COALESCE", fn("ROUND", fn("AVG", col("rating")), 1), 0),
          "avgRating",
        ],
        [fn("COUNT", col("id")), "reviewsCount"],
      ],
      raw: true,
    });

    if (!user || !user.specialistInfo) {
      return res.status(404).json({ message: "Tapılmadı" });
    }

    return res.json({
      data: {
        ...user.get(),
        rating: {
          avgRating: reviewsStats?.avgRating ?? "",
          reviewsCount: reviewsStats?.reviewsCount ?? "",
        },
      },
    });
  } catch (error) {
    console.error("GET /user/:id error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

const getContactInfo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await User.findByPk(id, {
      attributes: ["phoneNumber"],
    });

    if (!user) {
      return res.status(404).json({
        message: "İstifadəçi tapılmadı",
      });
    }

    const specialistInfo = await SpecialistInfo.findOne({
      where: { userId: id },
      attributes: ["rawAddress", "locationUrl"],
    });

    if (!specialistInfo) {
      return res.status(404).json({
        message: "İstifadəçi tapılmadı",
      });
    }

    return res.json({
      data: {
        phoneNumber: user.get().phoneNumber,
        rawAddress: specialistInfo.get().rawAddress,
        locationUrl: specialistInfo.get().locationUrl,
      },
    });
  } catch (error) {
    console.error("GET /user/:id/contact error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

const reviewMechanic = async (req, res) => {
  try {
    const { problemId, comment, rating } = req.body;
    const user = req.user;
    const problem = await Problem.findOne({
      where: {
        id: problemId,
        status: PROBLEM_STATUS.COMPLETED,
        userId: user.id,
      },
      attributes: ["id"],
      include: [
        {
          model: OfferAgreement,
          as: "offerAgreement",
          attributes: ["id"],
          include: [
            {
              model: Offer,
              as: "offer",
              attributes: ["id"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (
      !problem ||
      !problem.offerAgreement ||
      !problem.offerAgreement.offer ||
      !problem.offerAgreement.offer.user
    ) {
      return res.status(404).json({
        message: "Problem tapılmadı",
      });
    }

    const offerId = problem.offerAgreement.offer.id;
    const offerAgreementId = problem.offerAgreement.id;
    const mechanicId = problem.offerAgreement.offer.user.id;

    const record = await MechanicReview.create({
      rating,
      comment,
      problemId,
      offerId,
      mechanicId,
      userId: user.id,
      offerAgreementId,
    });

    return res.json({
      data: record,
    });
  } catch (error) {
    console.error("POST /reviews error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

const getAllMechanics = async (req, res) => {
  try {
    const mechanics = await User.findAll({
      attributes: {
        exclude: ["password", "phoneNumber", "email", "role"],
        include: [
          [
            literal(`COALESCE(AVG("receivedReviews"."rating"), 0)::float`),
            "avgRating",
          ],
          [fn("COUNT", col("receivedReviews.id")), "reviewsCount"],
          [
            literal(
              'COALESCE(AVG("receivedReviews"."rating"), 0) * 10 + COUNT("receivedReviews"."id")::float',
            ),
            "score",
          ],
        ],
      },
      include: [
        {
          model: SpecialistInfo,
          as: "specialistInfo",
          required: true,
          attributes: { exclude: ["rawAddress", "locationUrl"] },
        },
        {
          model: MechanicReview,
          as: "receivedReviews",
          attributes: [],
          required: false,
        },
      ],
      group: ["User.id", "specialistInfo.id"],
      order: [[literal("score"), "DESC"]],
    });
    return res.json({ data: mechanics });
  } catch (error) {
    console.error("GET /mechanics error:", error);
    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

module.exports = {
  getMechanicInfo,
  getContactInfo,
  reviewMechanic,
  getAllMechanics,
};
