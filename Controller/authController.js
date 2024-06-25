const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const Profile = require('../Model/Profile');

const generateCoupleId = (username) => {
    const randomString = Math.random().toString(36).substring(2, 8);
    return username.charAt(0).toUpperCase() + randomString;
};

exports.signup = async (req, res) => {
    const { username, email, phone, password, gender, dateOfBirth } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, phone, passwordHash, gender, dateOfBirth });
        await newUser.save();
        const coupleId = generateCoupleId(username);
        const newProfile = new Profile({ userId: newUser._id, coupleId });
        await newProfile.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};
