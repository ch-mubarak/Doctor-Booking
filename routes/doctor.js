const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth");
const Doctor = require("../model/doctor");
const Appointment = require("../model/appointment");
const User = require("../model/user");
router.get("/get-doctor-info-by-id", authentication, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor)
      return res
        .status(404)
        .send({ message: "couldn't find doctor info", success: false });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error getting doctor info" });
  }
});

router.put("/update-doctor-account-info", async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.body.doctorId, req.body);
    res
      .status(200)
      .send({ message: "Doctor Info updated successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating info" });
  }
});

router.get("/get-doctor-appointments", authentication, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({
      doctorId: doctor.id,
    }).populate({
      path: "userId",
      model: "User",
    });
    if (!appointments)
      return res
        .status(200)
        .send({ message: "No appointments found", success: false });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res
      .send(500)
      .send({ message: "Error fetching appointments", success: false });
  }
});

router.post("/change-appointment-status", authentication, async (req, res) => {
  try {
    const { status, appointmentInfo } = req.body;
    const appointment = await Appointment.findById(appointmentInfo._id);
    appointment.status = status;
    await appointment.save();
    const patient = await User.findById(appointmentInfo.userId);
    const doctor= await Doctor.findById(appointmentInfo.doctorId)
    patient.unseenNotifications.unshift({
      type: "new-appointment-update",
      message: `your appointment with ${doctor.firstName} ${doctor.lastName} has been ${status}`,
      onClickPath: "/appointments",
    });
    await patient.save();
    res.status(200).send({
      message: `appointment status for ${patient.name} is ${appointment.status}`,
      success: true,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "something went wrong", success: false });
  }
});
module.exports = router;
