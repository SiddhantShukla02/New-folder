const mongoose = require('mongoose');
const doctors = require('./doctors');

const hospitalSchema = new mongoose.Schema({
    name: String,
    location: String,
    description: String,
    specialties : [String],
    phone: String,
    email: String,
    imageurl: String,
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }]  
});

module.exports = mongoose.model('Hospital', hospitalSchema);