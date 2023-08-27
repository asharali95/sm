import mongoose from "mongoose";

// Define the Chat Schema
const chatSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // You can specify the referenced model here, assuming 'User' represents employees
    required: true,
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // You can specify the referenced model here, assuming 'User' represents employers
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobs", // You can specify the referenced model here, assuming 'Job' represents jobs
    required: true,
  },
  allowed: {
    type: Boolean,
    default: false, // Default value is false
  },
},{
  timestamps: true, // Enable timestamps option
});

// Create the Chat model
// const Chat = mongoose.model("Chat", chatSchema);

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);

