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
    level: { type: Number },
    text: { type: String },
    items: [{ type: String }],
    code: { type: String },
    url: { type: String },
    images: [{ type: String }],
    question: { type: String },
    answers: [{ type: String }],
    correctIndex: { type: Number }
}, { _id: false });

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    blocks: { type: [ContentBlockSchema], default: [] },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', LessonSchema);
