const {
  Problem,
  User,
  CarBrand,
  CarModel,
  Category,
  SpecialistInfo,
} = require("../../conf/db/models");
const { comparePassword, hashPassword } = require("../auth/utils");
const { PROBLEM_STATUS } = require("../problems/constants");

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

module.exports = {
  completeProblem,
  cancelProblem,
  getUsersProblems,
  updatePassword,
  updateProfile,
};
