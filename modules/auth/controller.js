const SpecialistInfo = require("../../conf/db/models/SpecialistInfo");
const User = require("../../conf/db/models/User");
const { ACCESS_TOKEN, USER_ROLES } = require("./constants");
const { comparePassword, generateToken, hashPassword } = require("./utils");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "İstifadəçi tapılmadı",
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "İstifadəçi adı və ya parol səhvdir",
      });
    }
    const token = generateToken(user.id);
    res.cookie(ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 5,
    });

    return res.status(200).json({
      message: "Giriş uğurlu",
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "An error occurred during login",
    });
  }
};

const register = async (req, res) => {
  try {
    const { mechanic, ...userData } = req.body;

    // NOTE: Sequelize doesn't support OR like this in array form
    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { email: userData.email },
          { phoneNumber: userData.phoneNumber },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "İstifadəçi artıq mövcuddur",
      });
    }

    const newPassword = await hashPassword(userData.password);

    const newUser = await User.create({
      ...userData,
      role: USER_ROLES.BASIC,
      password: newPassword,
    });

    if (mechanic) {
      await SpecialistInfo.create({
        ...mechanic,
        userId: newUser.id,
      });
    }

    return res.status(200).json(true);
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie(ACCESS_TOKEN);

    return res.status(200).json({
      data: {
        message: "Çıxış uğurlu oldu",
      },
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    // user should already be attached by auth middleware
    const user = req.user;

    const specialistInfo = await SpecialistInfo.findOne({
      where: { userId: user.id },
    });

    return res.status(200).json({
      data: {
        ...(user.toJSON?.() || user),
        specialistInfo,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  login,
  logout,
  register,
  getMe,
};
