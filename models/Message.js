import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String, // ID of the sender (can be admin, store staff, or mill staff)
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readers: [
    {
      type: String, // List of user IDs who have read the message
    },
  ],
  status: {
    type: String,
    enum: ["sent", "read"],
    default: "sent",
  },
});

// messageSchema.pre("save", function (next) {
//   this.timestamp = Date.now();
//   next();
// });

const Message = mongoose.model("Message", messageSchema);

export default Message;
