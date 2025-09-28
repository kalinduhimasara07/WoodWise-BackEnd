import Message from "../models/Message.js";

export async function sendMessage(req, res) {
  try {
    const { senderId, messageContent } = req.body;

    if (!senderId || !messageContent) {
      return res.status(400).json({
        success: false,
        message: "Both senderId and messageContent are required.",
      });
    }

    const newMessage = new Message({
      senderId,
      message: messageContent,
      status: "sent",
    });

    await newMessage.save();

    res.status(200).json({
      success: true,
      message: "Message sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function markMessageAsRead(req, res) {
  try {
    const { messageId, userId } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    if (!message.readers.includes(userId)) {
      message.readers.push(userId);
    }

    const allUsers = ["admin", "storeStaff", "millStaff"];
    if (message.readers.length === allUsers.length) {
      message.status = "read";
    }

    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marked as read successfully.",
      data: message,
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllMessages(req, res) {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No messages found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully.",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
