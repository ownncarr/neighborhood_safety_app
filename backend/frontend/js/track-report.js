const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Report = require('../models/report'); // Make sure to define a Report model

const router = express.Router();

// Route to fetch incidents reported by the authenticated user
router.get('/', protect, async (req, res) => {
    try {
        // Fetch all incidents reported by the logged-in user
        const incidents = await Report.find({ user: req.user.id });

        if (!incidents || incidents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No incidents reported by this user.',
            });
        }

        res.status(200).json({
            success: true,
            data: incidents,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reported incidents.',
        });
    }
});

module.exports = router;
