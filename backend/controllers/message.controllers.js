import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import crypto from "crypto";  // Import the crypto module

// Define the encryption algorithm and key
const algorithm = 'aes-256-cbc';
const secretKey = '12345678901234567890123456789012';  //  actual secret key
const ivLength = 16;  // AES block size

// Encryption function
function encrypt(text) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    console.log('IV:', iv.toString('hex'));
    console.log('Encrypted:', encrypted);
    return iv.toString('hex') + ':' + encrypted;
}

// Decryption function
function decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    console.log('IV for decryption:', iv.toString('hex'));
    console.log('Encrypted Text:', encryptedText.toString('hex'));
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    console.log('Decrypted:', decrypted);
    return decrypted;
}


export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Encrypt the message content
        const encryptedMessage = encrypt(message);

        // Log the encrypted message to the console (for debugging purposes)
        console.log("Encrypted Message: ", encryptedMessage);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message: encryptedMessage,  // Store the encrypted message
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Run these operations in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "internal server error" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // Populate with actual messages

        if (!conversation) return res.status(200).json([]);

        // Decrypt the messages
        const messages = conversation.messages.map(msg => {
            return {
                ...msg.toObject(),
                message: decrypt(msg.message)  // Decrypt the message content
            };
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "internal server error" });
    }
};