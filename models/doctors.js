const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: String,
    specialty: String,
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    experience: Number,
    phone: String,
    imageurl: String,
    email: String
});

module.exports = mongoose.model('Doctor', doctorSchema);