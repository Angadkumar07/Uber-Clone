const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controller/user.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters long"),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  loginUser
);

router.get("/profile", authUser, getProfile);

router.post("/logout", authUser, logoutUser);

module.exports = router;
