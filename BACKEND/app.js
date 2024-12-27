const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const app = express();
dotenv.config();

//connect to database
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRoutes);
app.use("/captain", captainRoutes);

app.get("/", (req, res) => {
  res.send("welcome to the backend");
});

module.exports = app;
