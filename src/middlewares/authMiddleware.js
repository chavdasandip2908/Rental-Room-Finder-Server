const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token!" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
<<<<<<< HEAD
    return res.status(403).json({ message: "Access denied. You are not authorized to perform this action." });
=======
    return res.status(403).json({ message: "Access Forbidden!" });
>>>>>>> 294043b (add payment gatway)
  }
  next();
};

module.exports = { protect, isAdmin };
