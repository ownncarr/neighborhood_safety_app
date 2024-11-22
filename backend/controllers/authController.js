const User = require('../models/user');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ name, email, password, role });
    
    try {
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// User Login
// authController.js

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with role included
    const token = jwt.sign(
        { userId: user._id, role: user.role }, // Make sure user.role is correct
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Send response with token and role
    res.status(200).json({
        message: 'Login successful',
        token,
        role: user.role  // Ensure the role is included in the response
    });
};