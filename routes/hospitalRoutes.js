// routes/hospitalRoutes.js
import express from "express";
import Hospital from "../models/hospitals.js";

const router = express.Router();

// GET /hospitals  -> list all hospitals
router.get("/", async (req, res) => {
  try {
    // populate doctors so the list view can show number of doctors (if needed)
    const hospitals = await Hospital.find().populate("doctors", "name specialization");
    res.render("hospitals", { hospitals });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET /hospitals/:id  -> show details for one hospital (including doctors)
router.get("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate("doctors");
    if (!hospital) return res.status(404).send("Hospital not found");
    // send hospital (which includes hospital.doctors)
    res.render("hospital_details", { hospital });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
