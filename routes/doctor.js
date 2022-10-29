const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth");
const Doctor = require("../model/doctor");

router.get("/get-doctor-info-by-id", authentication, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if(!doctor) return res.status(404).send({message:"couldn't find doctor info",success:false})
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

module.exports = router;
