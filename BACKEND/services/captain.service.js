const Captain = require("../models/captain.model");

module.exports.createCaptain = async ({
  fullname,
  email,
  password,
  vehicle,
  location,
}) => {
  try {
    if (!fullname || !email || !password || !vehicle || !location) {
      throw new Error("All fields are required");
    }
    const captain = await Captain.create({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email,
      password,
      vehicle: {
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        type: vehicle.type,
      },
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
    return captain;
  } catch (err) {
    console.log(err);
    return err;
  }
};
