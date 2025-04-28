const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
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
    issuedAt: {
        type: Date,
        default: Date.now
    },
    // Опційно: URL або шлях до зображення бейджа
    // badgeUrl: {
    //   type: String,
    //   default: ''
    // }
});

module.exports = mongoose.model('Badge', BadgeSchema);
