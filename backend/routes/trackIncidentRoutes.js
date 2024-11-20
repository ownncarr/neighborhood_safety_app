const express = require('express');
const router = express.Router();
const Incident = require('../models/incident'); // Your Incident model

// GET route to track incidents by ID or status
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Find the incident by ID or status
        const incident = await Incident.findById(id);

        if (!incident) {
            return res.status(404).json({ success: false, message: 'Incident not found' });
        }

        // Respond with the incident details
        res.json({ success: true, incident });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to retrieve incident' });
    }
});

// GET route to fetch all incidents (could be filtered by status or type)
router.get('/', async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 }); // Get latest first
        res.json({ success: true, incidents });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to retrieve incidents' });
    }
});

module.exports = router;
