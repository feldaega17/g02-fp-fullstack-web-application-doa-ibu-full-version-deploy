import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, getUserSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

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
      message,
      createdAt: new Date(),
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const seenMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Find the conversation involving both users
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if the sender is part of the conversation
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({
        error: "You are not authorized to mark these messages as seen",
      });
    }

    // Update messages that are unread
    const unreadMessageIds = conversation.messages
      .filter((msg) => !msg.read)
      .map((msg) => msg._id);

    await Message.updateMany(
      { _id: { $in: unreadMessageIds } },
      { $set: { read: true }, $currentDate: { updatedAt: true } }
    );

    const userSocketId = getUserSocketId();
    if (userSocketId) {
      io.to(userSocketId).emit("messagesSeen", {
        conversationId: conversation._id,
        messages: unreadMessageIds.map((msg) => ({ id: msg._id, read: true })),
      });
    }

    res.status(200).json({ message: "Messages marked as read successfully" });
  } catch (error) {
    console.log("Error in seenMessage controller: ", error.message);
    // res.status(500).json({ error: "Internal server error" });
  }
};
