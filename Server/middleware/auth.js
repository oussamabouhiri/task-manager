const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  // Récupérer le token du header
  const token = req.header("x-auth-token");

  // Vérifier s'il n'y a pas de token
  if (!token) {
    return res.status(401).json({ msg: "No token, x-auth-token denied" });
  }

  // Vérifier le token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
