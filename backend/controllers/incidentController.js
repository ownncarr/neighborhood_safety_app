const Incident = require('../models/incident');

// Report Incident
exports.reportIncident = async (req, res) => {
    try {
        const { title, description, location, category, photo } = req.body;

        const incident = await Incident.create({
            title,
            description,
            location,
            category,
            photo,
            reportedBy: req.user._id
        });

        res.status(201).json({ success: true, data: incident });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error reporting incident' });
    }
};

// Get All Incidents (Admin & Governing Body)
exports.getAllIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().populate('reportedBy', 'email');
        res.status(200).json({ success: true, data: incidents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching incidents' });
    }
};

// Get User's Incidents (Resident)
exports.getUserIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find({ reportedBy: req.user._id });
        res.status(200).json({ success: true, data: incidents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user incidents' });
    }
};

// Update Incident Status (Governing Body)
exports.updateIncidentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const incident = await Incident.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!incident) {
            return res.status(404).json({ success: false, message: 'Incident not found' });
        }

        res.status(200).json({ success: true, data: incident });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating incident status' });
    }
};
