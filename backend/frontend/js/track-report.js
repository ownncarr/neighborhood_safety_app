const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Report = require('../models/report'); // Report model to interact with the database

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

// Route to create a new incident report (only for authenticated residents)
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, location, category, photo } = req.body;

        // Validation
        if (!title || !description || !location || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields.',
            });
        }

        const newReport = new Report({
            title,
            description,
            location,
            category,
            photo,
            user: req.user.id, // Associate the report with the logged-in user
        });

        await newReport.save();
        res.status(201).json({
            success: true,
            data: newReport,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating a new report.',
        });
    }
});

// Route to update the status of an incident (for government body or admin)
router.put('/:id', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'in-progress', 'completed'];

        // Check if the status is valid
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status provided.',
            });
        }

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found.',
            });
        }

        // Check if the user is authorized to update the status (admin or government body)
        if (!['admin', 'governing-body'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update the report status.',
            });
        }

        report.status = status;
        await report.save();

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating the report status.',
        });
    }
});

module.exports = router;