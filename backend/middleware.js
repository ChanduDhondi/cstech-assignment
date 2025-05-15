require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token Required!" });
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decode._id;
    next();
  } catch (err) {
    console.log("Access Denied", err);
    res
      .status(401)
      .json({ message: "Authentication Error", error: err.message });
  }
};

module.exports = { authMiddleware };
