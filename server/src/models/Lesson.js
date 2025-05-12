// server/src/models/Lesson.js
const mongoose = require('mongoose');

const ContentBlockSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['heading', 'paragraph', 'list', 'quote', 'code', 'video', 'image', 'quiz'],
        required: true
    },
    // Поля для різних типів
    level: { type: Number },        // для heading (1–6)
    text: { type: String },        // для paragraph, heading, quote
    items: [{ type: String }],      // для list
    code: { type: String },        // для code блоків
    url: { type: String },        // для video
    images: [{ type: String }],      // для image
    question: { type: String },        // для quiz
    answers: [{ type: String }],      // для quiz
    correctIndex: { type: Number }        // для quiz
}, { _id: false });

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    blocks: { type: [ContentBlockSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', LessonSchema);
