const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  vehicle: {
    color: {
      type: String,
      required: [true, "Vehicle color is required"],
    },
    plate: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Vehicle capacity is required"],
    },
    type: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["car", "motorcycle", "auto"],
    },
  },
  location: {
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: [-90, "Latitude must be at least -90"],
      max: [90, "Latitude must be at most 90"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: [-180, "Longitude must be at least -180"],
      max: [180, "Longitude must be at most 180"],
    },
  },
  isAvailable: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  socketId: {
    type: String,
  },
});

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const Captain = mongoose.model("Captain", captainSchema);

module.exports = Captain;
