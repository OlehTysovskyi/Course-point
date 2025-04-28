const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    passedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', ProgressSchema);