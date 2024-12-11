import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        fileUrl: { type: String, required: false },
        fileType: { type: String, required: false },
      },
    ],
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio"],
      default: "text", // Default to text messages
    },
  },
  {
    collection: "doa-ibu-message",
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
