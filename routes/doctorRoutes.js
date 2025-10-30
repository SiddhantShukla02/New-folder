import express from "express";
import Doctor from "../models/doctors.js";
const router = express.Router();

// Get all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('hospital');
        res.render('doctors', { doctors });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Get doctor details
router.get('/doctors/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('hospital');
        res.render('doctorDetails', { doctor });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

export default router;
