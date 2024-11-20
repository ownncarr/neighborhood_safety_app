const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const trackReports = require('./routes/track-reports'); 
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reports', trackReports);

// Serve static files (if your frontend is in the 'frontend' directory)
app.use(express.static(path.join(__dirname, 'frontend')));  // or 'public'

// Handle the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html')); // Adjust if your HTML files are elsewhere
});

// Serve uploaded files (for incident photos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));
