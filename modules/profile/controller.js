const { fn, col } = require("sequelize");
const {
  Problem,
  User,
  CarBrand,
  CarModel,
  Category,
  SpecialistInfo,
  MechanicReview,
  Offer,
  Service,
} = require("../../conf/db/models");
const { comparePassword, hashPassword } = require("../auth/utils");
const { PROBLEM_STATUS, OFFER_STATUS } = require("../problems/constants");

const completeProblem = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const problem = await Problem.findByPk(id);

    if (!problem || problem.status !== PROBLEM_STATUS.ASSIGNED) {
      return res.status(404).json({
        message: "Problem tapılmadı",
      });
    }

    await problem.update({
      status: PROBLEM_STATUS.COMPLETED,
    });

    return res.json({
      data: {
        archived: id,
      },
    });
  } catch (error) {
    console.error("PUT /problems/:id/complete error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

const cancelProblem = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    // Soft cancel (status update)
    await Problem.update(
      { status: PROBLEM_STATUS.CANCELLED },
      { where: { id } },
    );

    return res.json({
      data: {
        deleted: id,
      },
    });
  } catch (error) {
    console.error("DELETE /problems/:id error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

const getUsersProblems = async (req, res) => {
  try {
    const user = req.user;
    const problems = await Problem.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: { exclude: ["password", "phoneNumber", "email", "role"] },
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
        {
          model: Category,
          as: "category",
        },
      ],
    });

    return res.json({
      data: problems,
    });
  } catch (error) {
    console.error("GET /problems error:", error);

    return res.status(500).json({
      message: "Server xətası baş verdi",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "İstifadəçi tapılmadı",
      });
    }

    const { oldPassword, newPassword } = req.body;

    // Verify old password
    const isOldPasswordCorrect = await comparePassword(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        message: "Cari şifrə yanlışdır",
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      data: { success: true },
    });
  } catch (error) {
    console.error("PATCH /user/change-password error:", error);

    return res.status(500).json({
      message: "Server xətası",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const mechanicInfo = await SpecialistInfo.findOne({
      where: { userId: user.id },
    });
    const body = req.body;
    console.log(body);
    const fullName = body.fullName || user.fullName;
    const phoneNumber = body.phoneNumber || user.phoneNumber;
    const email = body.email || user.email;

    // update user
    await User.update(
      { fullName, phoneNumber, email },
      { where: { id: user.id } },
    );

    if (mechanicInfo) {
      let profession = body["mechanic[profession]"] || mechanicInfo.profession;

      const city = body["mechanic[city]"] || mechanicInfo.city;

      const objectName =
        body["mechanic[objectName]"] || mechanicInfo.objectName;

      const experienceYears =
        body["mechanic[experienceYears]"] || mechanicInfo.experienceYears;

      const rawAddress =
        body["mechanic[rawAddress]"] || mechanicInfo.rawAddress;

      const locationUrl =
        body["mechanic[locationUrl]"] || mechanicInfo.locationUrl;

      const bio = body["mechanic[bio]"] || mechanicInfo.bio;

      await SpecialistInfo.update(
        {
          city,
          objectName,
          experienceYears,
          rawAddress,
          locationUrl,
          bio,
          profession,
        },
        { where: { userId: user.id } },
      );
    }

    return res.json({
      data: {
        success: true,
      },
    });
  } catch (error) {
    console.error("PUT /profile error:", error);

    return res.status(500).json({
      message: "Server xətası",
    });
  }
};

const becomeMechanic = async (req, res) => {
  try {
    const user = req.user;
    const existingMechanicInfo = await SpecialistInfo.findOne({
      where: { userId: user.id },
    });

    if (existingMechanicInfo) {
      return res.status(400).json({
        message: "Siz onsuz da usta statusundasınız",
      });
    }

    const body = req.body;

    await SpecialistInfo.create({
      userId: user.id,
      ...body,
    });

    return res.json({
      data: {
        message: "Usta statusu uğurla əldə edildi",
      },
    });
  } catch (error) {
    console.error("POST /specialist-info error:", error);

    return res.status(500).json({
      message: "Server xətası",
    });
  }
};

const getMechanicRatings = async (req, res) => {
  try {
    const user = req.user;
    const mechanicInfo = await SpecialistInfo.findOne({
      attributes: ["id"],
      where: { userId: user.id },
    });

    if (!mechanicInfo) {
      return res.status(404).json("User not found");
    }

    const reviews = await MechanicReview.findAll({
      where: { mechanicId: user.id },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["fullName"],
        },
        {
          model: Problem,
          as: "problem",
        },
      ],
    });

    return res.json({
      data: reviews,
    });
  } catch (error) {
    console.error("GET /mechanic/reviews error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getPanelInfo = async (req, res) => {
  try {
    const user = req.user;
    const specialistInfo = await SpecialistInfo.findOne({
      where: { userId: user.id },
    });

    if (!specialistInfo) {
      return res.status(401).json({});
    }

    const allOffersCount = await Offer.count({
      where: {
        userId: user.id,
      },
    });

    const acceptedOfferCount = await Offer.count({
      where: {
        userId: user.id,
        status: OFFER_STATUS.ACCEPTED,
      },
    });

    const servicesCount = await Service.count({
      where: {
        userId: user.id,
      },
    });

    const services = await Service.findAll({
      where: {
        userId: user.id,
      },
      limit: 3,
      order: [["createdAt", "DESC"]],
    });

    const offers = await Offer.findAll({
      where: {
        userId: user.id,
      },
      limit: 3,
      order: [["createdAt", "DESC"]],
    });

    const reviewsStats = await MechanicReview.findOne({
      where: {
        mechanicId: user.id,
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

    return res.json({
      data: {
        offerCounts: {
          allOffersCount,
          acceptedOfferCount,
        },

        servicesCount,

        rating: {
          avgRating: reviewsStats?.avgRating,
          reviewsCount: reviewsStats?.reviewsCount,
        },

        services,

        offers,
      },
    });
  } catch (error) {
    console.error("GET /mechanic/dashboard error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getMechanicOffers = async (req, res) => {
  try {
    const user = req.user;

    const offers = await Offer.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Problem,
          as: "problem",
        },
      ],
    });

    return res.json({
      data: offers,
    });
  } catch (error) {
    console.error("GET /offers error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const offer = await Offer.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!offer) {
      return res.status(404).json({
        message: "Təklif tapılmadı",
      });
    }
    await offer.destroy();
    return res.status(200).json({
      data: {
        message: "Təklif silindi",
      },
    });
  } catch (error) {
    console.error("DELETE /offers/:id error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const service = await Service.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Servis tapılmadı",
      });
    }

    const body = req.body;

    await service.update(body);

    return res.status(200).json({
      data: {
        message: "Servis uğurla dəyişdirildi",
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server xətası",
      error: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const service = await Service.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Servis tapılmadı",
      });
    }

    await service.destroy();

    return res.status(200).json({
      message: "Servis silindi",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server xətası",
      error: error.message,
    });
  }
};

const getMechanicServices = async (req, res) => {
  try {
    const user = req.user;
    const specialistInfo = await SpecialistInfo.findOne({
      where: { userId: user.id },
    });

    if (!specialistInfo) {
      return res.status(401).json({});
    }

    const services = await Service.findAll({
      where: { userId: user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "profilePicture"],
          include: [
            {
              model: SpecialistInfo,
              as: "specialistInfo",
              attributes: {
                exclude: ["rawAddress", "locationUrl"],
              },
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      data: services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server xətası",
      error: error.message,
    });
  }
};

module.exports = {
  completeProblem,
  cancelProblem,
  getUsersProblems,
  updatePassword,
  getMechanicRatings,
  updateProfile,
  becomeMechanic,
  getPanelInfo,
  getMechanicOffers,
  deleteOffer,
  updateService,
  deleteService,
  getMechanicServices,
};
