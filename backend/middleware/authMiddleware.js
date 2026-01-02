const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header - Express headers are lowercase
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Auth successful - User ID:', decoded.id, 'Role:', decoded.role);
        next();
    } catch (error) {
        console.error('JWT verification error:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
