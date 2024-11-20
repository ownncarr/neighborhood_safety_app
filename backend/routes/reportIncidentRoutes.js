const express = require('express');
const router = express.Router();
const Incident = require('../models/incident'); // Your Incident model
const multer = require('multer'); // To handle file uploads

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// POST route to report a new incident
router.post('/', upload.single('photo'), async (req, res) => {
    const { incidentType, description } = req.body;
    const photo = req.file ? req.file.path : null;

    if (!incidentType || !description) {
        return res.status(400).json({ success: false, message: 'Incident type and description are required' });
    }

    try {
        // Create a new incident
        const newIncident = new Incident({
            incidentType,
            description,
            photo,
            status: 'pending', // Default status
        });

        // Save the incident to the database
        await newIncident.save();

        // Respond with success message
        res.json({ success: true, message: 'Incident reported successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while reporting the incident' });
    }
});

module.exports = router;
