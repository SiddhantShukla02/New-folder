import express from "express";
import Hospital from "../models/hospitals.js";
import Doctor from "../models/doctors.js";
const router = express.Router();


router.get("/", async (req, res) => {
  res.render("index");
});

// Get all hospitals
router.get("/hospitals", async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.render('hospitals', { hospitals });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Get hospital details 
router.get("/hospitals/:id", async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id).populate('doctors');
        if (!hospital) {
        return res.status(404).send("Hospital not found");
        }

        res.render('hospital_details', { hospital });

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

export default router;