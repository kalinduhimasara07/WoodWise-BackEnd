import Message from "../models/Message.js";

export async function sendMessage(req, res) {
  try {
    // Extract senderId and message from the request body
    const { senderId, messageContent } = req.body;

    // Check if senderId and messageContent are provided
    if (!senderId || !messageContent) {
      return res.status(400).json({
        success: false,
        message: "Both senderId and messageContent are required.",
      });
    }

    // Create a new message instance
    const newMessage = new Message({
      senderId,
      message: messageContent,
      status: "sent", // Initially, the message is "sent"
    });

    // Save the new message to the database
    await newMessage.save();

    // Send a success response with the saved message
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
    // Extract message ID and user ID who read the message
    const { messageId, userId } = req.body;

    // Find the message by ID
    const message = await Message.findById(messageId);

    // Check if the message exists
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    // Add the user to the readers array if not already added
    if (!message.readers.includes(userId)) {
      message.readers.push(userId);
    }

    // Update status to "read" if all users have read it
    const allUsers = ["admin", "storeStaff", "millStaff"]; // Example list of all participants
    if (message.readers.length === allUsers.length) {
      message.status = "read"; // Update status to "read" when all have read
    }

    // Save the updated message
    await message.save();

    // Send a success response
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
    // Fetch all messages from the database, sorted by timestamp (newest first)
    const messages = await Message.find().sort({ timestamp: -1 });

    // If no messages are found, return a message indicating that
    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No messages found.",
      });
    }

    // Send a success response with the fetched messages
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
