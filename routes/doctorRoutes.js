const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctors');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('hospital');
        res.render('doctors', { doctors });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Get doctor details
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('hospital');
        res.render('doctorDetails', { doctor });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});
module.exports = router;