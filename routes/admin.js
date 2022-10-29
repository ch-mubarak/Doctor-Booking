const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth");
const User = require("../model/user");
const Doctor = require("../model/doctor");

router.use(authentication);

router.get("/get-all-users", async (req, res) => {
  try {
    const allUsers = await User.find({}, { password: 0 });
    res.status(200).send({
      message: "Users fetched successfully",
      data: allUsers,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-all-doctors", async (req, res) => {
  try {
    const allDoctors = await Doctor.find();
    res.status(200).send({
      message: "Doctors fetched successfully",
      data: allDoctors,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong" });
  }
});

router.post("/change-doctor-status", async (req, res) => {
  try { 
    const { doctorId, userID, action } = req.body;
    const doctor = await Doctor.findById(doctorId);
    const user = await User.findById(userID, { password: 0 });
    doctor.status = action === "approve" ? "approved" : "rejected";
    user.isDoctor = action === "approve" ? true : false;
    user.unseenNotifications.unshift({
      type: "new-doctor-request-update",
      message: `Your request for doctor application has been ${doctor.status}`,
      onClickPath: "/notifications",
    });
    await doctor.save();
    await user.save();
    return res
      .status(200)
      .send({
        message: `Status changed to ${doctor.status}`,
        success: true,
        data: user,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong", success: false });
  }
});

module.exports = router;
