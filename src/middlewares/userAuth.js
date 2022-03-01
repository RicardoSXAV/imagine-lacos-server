require("dotenv").config();

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const userToken = req.cookies.userToken;

    if (!userToken) {
      return res
        .status(401)
        .json({ error: true, message: "Você não está autenticado!" });
    }

    const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET);

    req.userData = { userId: decodedToken.id, role: decodedToken.role };

    next();
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
