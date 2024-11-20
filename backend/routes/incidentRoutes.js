const express = require('express');
const { reportIncident, getAllIncidents, getUserIncidents, updateIncidentStatus } = require('../controllers/incidentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Report Incident (Residents Only)
router.post('/', protect, authorize('resident'), reportIncident);

// Get All Incidents (Admin & Governing Body)
router.get('/all', protect, authorize('admin', 'governing-body'), getAllIncidents);

// Get User's Incidents (Residents)
router.get('/user', protect, authorize('resident'), getUserIncidents);

// Update Incident Status (Governing Body Only)
router.put('/:id/status', protect, authorize('governing-body'), updateIncidentStatus);

module.exports = router;
