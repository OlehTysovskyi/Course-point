const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: String,
    content: String,
    videoUrl: String,
    images: [String],
    questions: [Object],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', LessonSchema);