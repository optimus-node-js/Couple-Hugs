const Message = require('../Model/message.model');
const io = require('socket.io')();

exports.sendMessage = async (req, res) => {
    const { receiverId, message } = req.body;
    const newMessage = new Message({
        senderId: req.userId,
        receiverId,
        message
    });
    try {
        await newMessage.save();
        // Emit message to receiver using Socket.IO
        io.to(receiverId).emit('message', newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
};

exports.getMessages = async (req, res) => {
    const { partnerId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.userId, receiverId: partnerId },
                { senderId: partnerId, receiverId: req.userId }
            ]
        }).sort('timestamp');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving messages' });
    }
};
