const { timingSafeEqual, randomBytes, scrypt: _scrypt } = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("./constants");
const scrypt = promisify(_scrypt);

async function comparePassword(password, storedPassword) {
  const [salt, key] = storedPassword.split(":");
  const derivedKey = await scrypt(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return timingSafeEqual(keyBuffer, derivedKey);
}

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

module.exports = { comparePassword, generateToken, hashPassword };
