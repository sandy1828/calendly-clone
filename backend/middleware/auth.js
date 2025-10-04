const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id || payload.user?.id };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
