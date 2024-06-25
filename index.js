require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./Routes/auth');
const userRoutes = require('./Routes/user');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Couple Hugs API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        console.log(`App listening successfully on port : ${PORT} => http://localhost:${PORT}`);
    } catch (error) {
        console.error(error);
    }
});
