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
    return res.status(403).json({ message: "Access denied. You are not authorized to perform this action." });
  }
  next();
};

const isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Access denied. You are not authorized to perform this action." });
  }
  next();
};

// const isSelfOrAdmin = (req, res, next) => {
//   const loggedInUserId = req.user.id; // from protect middleware
//   const targetUserId = req.params.id; // assuming the route has /:id

//   // Allow if user is admin or accessing their own data
//   if (loggedInUserId === targetUserId || req.user.role === "admin") {
//     return next();
//   }

//   return res.status(403).json({ message: "Access denied. You can only access your own data or must be an admin." });
// };

module.exports = { protect, isAdmin, isSeller };
