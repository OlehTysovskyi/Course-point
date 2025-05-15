const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        default: []
    }],
    passedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        default: []
    }],
    // нове поле –&nbsp;накопичувальні бали за оцінювані модулі
    grade: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Гарантуємо одну-одному (user + course)
ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.models.Progress ||
    mongoose.model('Progress', ProgressSchema);
