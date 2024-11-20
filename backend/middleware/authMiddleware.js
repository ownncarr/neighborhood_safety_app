const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model if necessary

// Middleware to protect routes (ensure user is authenticated)
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

            // Attach user to the request
            req.user = await User.findById(decoded.id).select('-password'); // Exclude password from the user data
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            next(); // Proceed to the next middleware
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Middleware to restrict access based on roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied. Unauthorized role.' });
        }
        next(); // Proceed to the next middleware
    };
};

module.exports = { protect, authorize };
