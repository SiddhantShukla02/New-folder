const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospitals');
const Doctor = require('../models/doctors');

//Get Admin Dashboard
router.get('/', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        const doctors = await Doctor.find().populate('hospitals');
        res.render('adminDashboard', { hospitals, doctors });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

//POST add a new hospital
router.post('/add-hospital', async (req, res) => {
    try {
    const { name, location, description, specialties, phone, email, imageurl } = req.body;
    const newHospital = new Hospital({
        name,
        location,
        description,
        specialties: specialties ? specialties.split(',').map(s => s.trim()) : [],
        phone,
        email,
        imageurl
    });
    await newHospital.save();
    res.redirect('/admin');
    } catch (error) {
        res.status(500).send('Server Error');
    }   
});

//POST add a new doctor
router.post('/add-doctor', async (req, res) => {
    try {
    const { name, specialty, hospital, experience, phone, imageurl, email } = req.body;
    const newDoctor = new Doctor({
        name,
        specialty,
        hospital,
        experience,
        phone,
        imageurl,
        email
    });
    await newDoctor.save();
    console.log(`Doctor added : ${newDoctor,name}`);
    res.redirect('/admin');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;