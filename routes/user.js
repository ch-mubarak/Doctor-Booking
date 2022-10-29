const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const authentication = require("../middleware/auth");
const Doctor = require("../model/doctor");
const Appointment = require("../model/appointment");
const moment = require("moment");
const { now } = require("moment");

router.post("/register", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res
        .status(200)
        .send({ message: "User already exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    }
    // check password with bcrypt
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid credential", success: false });
    }
    //creating jwt token payload and secret id
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ message: "Login success", success: true, data: token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error logging in", success: false, err });
  }
});

router.post("/get-user-info-by-id", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, err });
  }
});

router.post("/apply-doctor-account", authentication, async (req, res) => {
  try {
    console.log(req.body.timings);
    const user = await User.findById(req.body.userId);
    if (user.isDoctor) {
      return res
        .status(200)
        .send({ message: "already applied", success: false });
    }
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    adminUser.unseenNotifications.unshift({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor.id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/admin/doctors",
    });
    await adminUser.save();
    res
      .status(201)
      .send({ message: "Successfully applied for doctor", success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error Applying doctor account", success: false, err });
  }
});

router.post("/mark-notification-as-seen", authentication, async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (user.unseenNotifications.length === 0) {
      return res
        .status(200)
        .send({ message: "There is nothing to move", success: false });
    }
    user.seenNotifications.unshift(...user.unseenNotifications);
    user.unseenNotifications = [];
    await user.save();
    user.password = undefined;
    res.status(201).send({
      message: "Moved to seen notification",
      success: true,
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong", success: false });
  }
});

router.post("/delete-all-notifications", authentication, async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (user.seenNotifications.length === 0) {
      return res
        .status(201)
        .send({ message: "Nothing to delete", success: false });
    }
    user.seenNotifications = [];
    await user.save();
    user.password = undefined;
    res.status(201).send({
      message: "Notification cleared successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong", success: false });
  }
});

router.get("/get-all-approved-doctors", authentication, async (req, res) => {
  try {
    const allDoctors = await Doctor.find({ status: "approved" });
    res.status(200).send({
      message: "fetched doctors list successfully",
      success: true,
      data: allDoctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error getting details" });
  }
});

router.get(
  "/get-doctor-info-by-id/:doctorId",
  authentication,
  async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.doctorId);
      if (!doctor) return res.status(404).send({ message: "doctor not found" });
      res.status(200).send({
        success: true,
        message: "Doctor info fetched successfully",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error getting doctor info" });
    }
  }
);

router.post("/book-doctor", authentication, async (req, res) => {
  try {
    console.log(req.body);
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    // pushing notification to Doctor's user account based on his userId
    const doctor = await User.findById(req.body.doctorInfo.userId);
    doctor.unseenNotifications.unshift({
      type: "new-appointment-request",
      message: `new appointment request has made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await doctor.save();
    res.status(200).send({ message: "Booking successful", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error while booking", success: false });
  }
});

router.post("/check-doctor-availability", async (req, res) => {
  try {
    const date = req.body.date;
    const currentDate = moment().format("DD-MM-YYYY");

    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .format("HH:mm");
    const toTime = moment(req.body.time, "HH:mm")
      .add(1, "hours")
      .format("HH:mm");
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
      // status: "approved",
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointment available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error checking availability" });
  }
});

module.exports = router;
