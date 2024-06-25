const User = require('../Model/User');
const Profile = require('../Model/Profile');

exports.getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.userId }).populate('userId', 'username email phone gender dateOfBirth');
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { profilePicture, bio } = req.body;
    try {
        const profile = await Profile.findOneAndUpdate(
            { userId: req.userId },
            { profilePicture, bio, updatedAt: Date.now() },
            { new: true }
        );
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user profile' });
    }
};

exports.connectPartner = async (req, res) => {
    const { coupleId } = req.body;
    try {
        const partnerProfile = await Profile.findOne({ coupleId });
        if (!partnerProfile) return res.status(404).json({ error: 'Partner not found' });

        const userProfile = await Profile.findOne({ userId: req.userId });

        // Check for gender-based connection
        const user = await User.findById(req.userId);
        const partner = await User.findById(partnerProfile.userId);
        if (user.gender === partner.gender) {
            return res.status(400).json({ error: 'Cannot connect partners of the same gender' });
        }

        userProfile.partnerId = partnerProfile.userId;
        partnerProfile.partnerId = userProfile.userId;

        userProfile.status = 'connected';
        partnerProfile.status = 'connected';

        await userProfile.save();
        await partnerProfile.save();

        res.json({ message: 'Partners connected successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error connecting partners' });
    }
};
