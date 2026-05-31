const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_EXPIRES_IN = "5d";
const ACCESS_TOKEN = "authToken";

const USER_ROLES = {
  BASIC: "@basic",
  ADMIN: "@admin",
};

module.exports = { USER_ROLES, JWT_EXPIRES_IN, JWT_SECRET, ACCESS_TOKEN };
