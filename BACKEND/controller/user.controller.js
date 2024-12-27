const userModel = require("../models/user.model");
const { validationResult } = require("express-validator");
const userService = require("../services/user.service");

module.exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, fullname } = req.body;
  const hashPassword = await userModel.hashPassword(password);

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  
  if (existingCaptainByPlate) {
    return res.status(400).json({ message: "Vehicle already exists" });
  };

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
  });

  const token = user.generateAuthToken();
  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000,
  });

  res.status(200).json({ token, user });
};

module.exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    res
      .status(200)
      .json({ user, message: "User profile fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.logoutUser = async (req, res) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  delete token;
  res.status(200).json({ message: "User logged out successfully" });
};
