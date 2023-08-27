import mongoose from "mongoose";

export const education_level_Schema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.education_level ||
  mongoose.model("education_level", education_level_Schema);
