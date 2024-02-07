const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthGuard = (role) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({
        message: "No token found",
      });
    }
    const accessToken = token.split(" ")[1];
    console.log(accessToken);
    console.log(process.env.ACCESS_TOKEN_SECRET);
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      console.log(user.role);
    
      if (role.includes(user.role) === false) {
        return res.status(401).json({
          message: "You are not authorized",
        });
      }
      req.user = user;
      next();
    });
  };
};

module.exports = AuthGuard;
