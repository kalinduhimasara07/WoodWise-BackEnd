import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
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
      type: String,
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
