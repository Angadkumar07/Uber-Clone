const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isblacklistToken = await blacklistModel.findOne({ token: token });

    if (isblacklistToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isblacklistToken = await blacklistModel.findOne({ token: token });

    if (isblacklistToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.captain = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
