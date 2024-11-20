const Announcement = require('../models/announcement');

// Create Announcement
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, description } = req.body;

        const announcement = await Announcement.create({
            title,
            description,
            createdBy: req.user.role,
        });

        res.status(201).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating announcement' });
    }
};

// Fetch All Announcements
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching announcements' });
    }
};
