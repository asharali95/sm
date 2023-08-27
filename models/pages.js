import mongoose from "mongoose";
export const pagesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "page tilte can't be left blank"],
    unique: true,
  },
  para1: {
    type: String,
  },
  para2: {
    type: String,
  },
  para3: {
    type: String,
  },
  para4: {
    type: String,
  },
  image: {
    type: {
      url: {
        type: String,
        required: [true, "Url can't be left blank"],
      },
      publicId: {
        type: String,
        required: [true, "PublicId can't be left blank"],
      },
    },
  },
  order: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Pages || mongoose.model("Pages", pagesSchema);
