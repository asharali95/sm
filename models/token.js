import mongoose from "mongoose";

export const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Number,
  },
  purpose: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Tokens || mongoose.model("Tokens", tokenSchema);
