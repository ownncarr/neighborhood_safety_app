const express = require('express');
const { createAnnouncement, getAnnouncements } = require('../controllers/annoucementController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Create Announcement (Admin & Governing Body Only)
router.post('/', protect, authorize('admin', 'governing-body'), createAnnouncement);

// Fetch All Announcements (Accessible to All Roles)
router.get('/', protect, getAnnouncements);

module.exports = router;
