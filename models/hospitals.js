const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: String,
    location: String,
    description: String,
    specialties : [String],
    phone: String,
    email: String,
    imageurl: String
});

module.exports = mongoose.model('Hospital', hospitalSchema);