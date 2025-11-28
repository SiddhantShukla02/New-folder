
import express from "express";
import Doctor from "../models/doctors.js";
import Hospital from "../models/hospitals.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("hospital", "name city").lean();
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// router.get("/:id", async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id).populate("hospital", "name city");
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.status(200).json(doctor);
//   } catch (err) {
//     console.error("Error fetching doctor:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const { name, specialization, experience, hospital } = req.body;

    const newDoctor = new Doctor({
      name,
      specialization,
      experience,
      hospital, 
    });

    const savedDoctor = await newDoctor.save();

    
    if (hospital && hospital.length > 0) {
      await Hospital.updateMany(
        { _id: { $in: hospital } },
        { $push: { doctors: savedDoctor._id } }
      );
    }

    res.status(201).json(savedDoctor);
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id",  async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).populate("hospital", "name city state").lean();

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
