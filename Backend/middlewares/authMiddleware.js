const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;
  
  // Check for Bearer token in header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded.id);
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }
    
    next();
  } catch (error) {
    console.log("Token verification error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Token is not valid" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired" });
    } else {
      return res.status(401).json({ msg: "Token is not valid" });
    }
  }
};
