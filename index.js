require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./Routes/auth');
const userRoutes = require('./Routes/user');

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get(['/', '/api', '/api/health'], (req, res) => {
    res.json({
        ok: true,
        service: 'couple-hugs-api',
        endpoints: ['POST /api/auth/signup', 'POST /api/auth/login', 'GET /api/user/profile', 'PUT /api/user/profile'],
    });
});

// Ensure the database is connected before handling API requests.
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        res.status(503).json({ message: 'Database unavailable' });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use((req, res) => res.status(404).json({ message: `Not found: ${req.originalUrl}` }));

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Couple Hugs API listening on http://localhost:${PORT}`));
}

module.exports = app;
