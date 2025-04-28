const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    title: String,
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    questions: [Object],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Module', ModuleSchema);