import mongoose from "mongoose";

// Define the Conversation Schema
const conversationSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // You can specify the referenced model here, assuming 'User' represents senders
    required: true,
  },
  // receiverId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User", // You can specify the referenced model here, assuming 'User' represents receivers
  //   required: true,
  // },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  attachment: {
    type: Boolean,
    default: false,
  },
  replyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    default: null,
  },

},{
  timestamps: true, // Enable timestamps option
});

// Create the Conversation model
export default
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
