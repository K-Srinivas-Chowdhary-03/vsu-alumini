const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "SVU_SECRET_KEY");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access Forbidden: Insufficient Permissions" });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
