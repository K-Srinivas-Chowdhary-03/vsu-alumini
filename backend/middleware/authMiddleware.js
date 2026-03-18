const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(`[AUTH] Verifying Token. Length: ${token?.length || 0}`);
  
  if (!token) {
    console.error("[AUTH] No token provided in Authorization header");
    return res.status(401).json({ error: "Access Denied: No token provided" });
  }

  try {
    const secret = process.env.JWT_SECRET || "VSU_SECRET_KEY";
    const verified = jwt.verify(token, secret);
    console.log(`[AUTH] Token verified successfully for user: ${verified.id}, role: ${verified.role}`);
    req.user = verified;
    next();
  } catch (err) {
    console.error(`[AUTH] Token Verification Failed: ${err.message}`);
    res.status(400).json({ error: "Invalid Token: " + err.message });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(`[AUTH] Authorizing for roles: [${roles.join(", ")}]. User Role: ${req.user?.role}`);
    if (!req.user || !roles.includes(req.user.role)) {
      console.error(`[AUTH] Authorization Failed. Expected one of [${roles.join(", ")}], got ${req.user?.role}`);
      return res.status(403).json({ error: `Access Forbidden: Insufficient Permissions (Role: ${req.user?.role || "None"})` });
    }
    console.log("[AUTH] Role Authorization Successful");
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
