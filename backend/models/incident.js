const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    photo: { type: String },
    status: { 
        type: String, 
        enum: ['Pending', 'In Progress', 'Completed'], 
        default: 'Pending' 
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', incidentSchema);


