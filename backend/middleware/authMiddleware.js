
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login first"
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing");

    return res.status(500).json({
      success: false,
      message: "Server configuration error"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again."
    });
  }
};

module.exports = authMiddleware;
