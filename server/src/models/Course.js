const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    published: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);