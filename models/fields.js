import mongoose from "mongoose";

export const education_field_Schema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.education_field ||
  mongoose.model("education_field", education_field_Schema);
