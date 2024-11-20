const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['theft', 'vandalism', 'safety-hazard', 'suspicious-activity'],
        required: true,
    },
    photo: {
        type: String, // URL or file path to the uploaded photo
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
