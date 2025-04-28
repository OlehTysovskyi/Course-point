const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: { type: String, enum: ['student', 'teacher'] },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RegistrationRequest', RequestSchema);