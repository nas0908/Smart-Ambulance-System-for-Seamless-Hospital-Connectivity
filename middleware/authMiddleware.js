const authUtils = require('../utils/authUtils');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = authUtils.verifyToken(token);

    if (!decoded) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Attach user data to the request
    next();
};

// Middleware to check for admin role
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
};

module.exports = { authenticateToken, authorizeAdmin };
