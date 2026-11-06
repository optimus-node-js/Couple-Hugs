const mongoose = require('mongoose');

let connecting = null;

// Connect once and reuse the connection (works for both a long-running server and serverless).
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');
    if (!connecting) {
        connecting = mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 }).catch((err) => {
            connecting = null;
            throw err;
        });
    }
    return connecting;
};

module.exports = connectDB;
