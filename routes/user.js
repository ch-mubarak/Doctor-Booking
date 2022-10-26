const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const authentication = require("../middleware/auth");
const Doctor = require("../model/doctor");

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
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isDoctor: user.isDoctor,
          unseenNotifications: user.unseenNotifications,
        },
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
    const user = await User.findById(req.body.userId);
    if (user.isDoctor) {
      return res
        .status(200)
        .send({ message: "already applied", success: false });
    }
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    adminUser.unseenNotifications.push({
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

module.exports = router;
