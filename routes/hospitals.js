const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospitals');
const Doctor = require('../models/doctors');

// Get all hospitals
router.get('/', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.render('hospitals', { hospitals });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Get hospital details 
router.get('/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        const doctors = await Doctor.find({ hospital: req.params.id });
        res.render('hospitalDetails', { hospital, doctors });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;