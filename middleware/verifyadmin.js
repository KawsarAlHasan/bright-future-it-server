const jwt = require("jsonwebtoken");
const db = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "You are not logged in",
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Forbidden access" });
      }

      const decodedAdminID = decoded.id;
      const [result] = await db.query(`SELECT * FROM admin WHERE id=?`, [
        decodedAdminID,
      ]);

      req.decodedAdmin = result[0];
      next();
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid Token",
      error: error.message,
    });
  }
};
