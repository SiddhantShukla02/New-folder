import express from "express";
import Hospital from "../models/hospitals.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { name, address, city, state, description, contact } = req.body;

    const newHospital = new Hospital({
      name,
      address,
      city,
      state,
      description,
      contact,
    });

    const savedHospital = await newHospital.save();

    res.status(201).json({
      message: "✅ Hospital added successfully",
      hospital: savedHospital,
    });
  } catch (err) {
    console.error("Error adding hospital:", err);
    res.status(500).json({ error: "Server error while adding hospital" });
  }
});


router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate("doctors", "name specialization");
    return res.status(200).json(hospitals);
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    return res.status(500).json({ error: "Server error while fetching hospitals" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findById(id).populate("doctors", "name specialization");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    console.error("Error fetching hospital by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
