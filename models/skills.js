import mongoose from "mongoose";

export const SkillSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
