const express = require("express");
const { body } = require("express-validator");
const {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
  updateCaptainProfile,
  deleteCaptainProfile,
} = require("../controller/captain.controller");
const { authCaptain } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
    body("vehicle.plate").notEmpty().withMessage("License plate is required"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity is required"),
    body("vehicle.type")
      .isIn(["car", "motorcycle", "auto"])
      .withMessage("Invalid vehicle type"),
    body("location.latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    body("location.longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
  ],
  registerCaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  loginCaptain
);

router.get("/profile", authCaptain, getCaptainProfile);

router.post("/logout", authCaptain, logoutCaptain);

router.patch("/profile", authCaptain, updateCaptainProfile);
router.delete("/profile", authCaptain, deleteCaptainProfile);

module.exports = router;
