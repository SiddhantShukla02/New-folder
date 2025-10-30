// routes/doctorRoutes.js
import express from "express";
import Doctor from "../models/doctors.js";

const router = express.Router();

// GET /doctors -> list all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("hospital", "name location");
    res.render("doctors", { doctors });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET /doctors/:id -> doctor details
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("hospital");
    if (!doctor) return res.status(404).send("Doctor not found");
    // Ensure view name matches the file you have:
    // You have views/doctor_details.ejs, so render that exact name:
    res.render("doctor_details", { doctor });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
