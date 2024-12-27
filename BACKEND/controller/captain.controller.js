const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const { createCaptain } = require("../services/captain.service");

// Register a new captain
module.exports.registerCaptain = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle, location } = req.body;

    // Check if email already exists
    const existingCaptain = await captainModel.findOne({ email });
    if (existingCaptain) {
      return res.status(400).json({ error: "Captain already exists" });
    }

    const existingCaptainByPlate = await captainModel.findOne({
      "vehicle.plate": vehicle.plate,
    });
    if (existingCaptainByPlate) {
      return res.status(400).json({ error: "Vehicle already exists" });
    }

    // Hash password
    const hashPassword = await captainModel.hashPassword(password);

    // Create a new captain
    const captainData = {
      fullname,
      email,
      password: hashPassword,
      vehicle,
      location,
    };
    const captain = await createCaptain(captainData);

    // Generate authentication token
    const token = captain.generateAuthToken(captain._id);

    // Add the token to the blacklist
    const blacklistToken = new userModel.BlacklistToken({ token });
    await blacklistToken.save();

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    // Set the token as a header
    res.setHeader("Authorization", `Bearer ${token}`);

    // Respond with the newly created captain and token
    res.status(201).json({ captain, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login a captain
module.exports.loginCaptain = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the captain exists
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(400).json({ error: "Invalid login credentials" });
    }

    // Validate the password
    const isMatch = await captain.comparePassword(password, captain.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid login credentials" });
    }

    // Generate a new token
    const token = captain.generateAuthToken(captain._id);

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    // Set the token as a header
    res.setHeader("Authorization", `Bearer ${token}`);

    // Send response with captain details and token
    res.json({ captain, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get captain profile
module.exports.getCaptainProfile = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    res.json({ captain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.logoutCaptain = async (req, res) => {
  try {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    delete token;
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update captain profile
module.exports.updateCaptainProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "fullname",
    "email",
    "password",
    "vehicle",
    "location",
    "isAvailable",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => {
      if (update === "fullname") {
        req.captain.fullname.firstname =
          req.body.fullname.firstname || req.captain.fullname.firstname;
        req.captain.fullname.lastname =
          req.body.fullname.lastname || req.captain.fullname.lastname;
      } else if (update === "vehicle") {
        req.captain.vehicle.color =
          req.body.vehicle.color || req.captain.vehicle.color;
        req.captain.vehicle.plate =
          req.body.vehicle.plate || req.captain.vehicle.plate;
        req.captain.vehicle.capacity =
          req.body.vehicle.capacity || req.captain.vehicle.capacity;
        req.captain.vehicle.type =
          req.body.vehicle.type || req.captain.vehicle.type;
      } else if (update === "location") {
        req.captain.location.latitude =
          req.body.location.latitude || req.captain.location.latitude;
        req.captain.location.longitude =
          req.body.location.longitude || req.captain.location.longitude;
      } else {
        req.captain[update] = req.body[update];
      }
    });

    await req.captain.save();
    res.json(req.captain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete captain profile
module.exports.deleteCaptainProfile = async (req, res) => {
  try {
    await req.captain.remove();
    res.json({
      message: "Captain profile deleted successfully",
      captain: req.captain,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
