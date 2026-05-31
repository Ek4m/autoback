const jwt = require("jsonwebtoken");
const User = require("../../conf/db/models/User");
const { JWT_SECRET, ACCESS_TOKEN } = require("./constants");

const checkAuth = async (req, res, next) => {
  console.log("__________COOKIES)))))))))))))))))))", req.cookies);
  try {
    let token = req.cookies[ACCESS_TOKEN];
    console.log("__________COOKIES)))))))))))))))))))", token);
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = { checkAuth };
