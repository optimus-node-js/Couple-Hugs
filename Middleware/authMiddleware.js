const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const header = req.headers.authorization || '';
    // Accept the token from the Authorization header (mobile app) or the httpOnly cookie (web).
    const token = header.startsWith('Bearer ') ? header.slice(7) : (req.cookies && req.cookies.token) || '';
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
