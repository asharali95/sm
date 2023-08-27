import mongoose from "mongoose";
import jobs from "./jobs";

export const userSchema = new mongoose.Schema(
  {
    //common fields
    email: {
      type: String,
      required: [true, "Email can't be left blank"],
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
      required: [
        function () {
          return this.role === "employer";
        },
        "Password can't be left blank",
      ],
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
            v
          );
        },
        message: (props) =>
          `Password Must Contain at Least 8 Characters,One Uppercase,One Lowercase, One Number, & One Special Character`,
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["employee", "employer", "site_admin"],
    },
    name: {
      type: String,
    },
    lastName: { type: String },

    about: {
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
    social: { type: String },
    phone: { type: String },
    address: { type: String },
    //employee fields
    education: {
      type: {
        level: {
          type: String,
        },
        field: {
          type: String,
        },
        _id: false,
      },
    },
    experience: {
      type: {
        title: {
          type: String,
        },
        company: {
          type: String,
        },
        _id: false,
      },
    },
    resume: {
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
    skills: { type: [String] },

    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: jobs.Jobs,
      },
    ],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: jobs.Jobs,
      },
    ],
    privateFields: { type: [String], default: ["email"] },
    currentEmployer: { type: String },
    currentEmployment: { type: String },
    availableFrom: { type: Date },
    //employer fields
    isExternal: {
      type: Boolean,
      default: false,
    },
    website: { type: String },
    verified: {
      type: Boolean,
      default: false,
    },
    isCompany: {
      type: Boolean,
      default: false,
    },
    companyType: {
      type: String,
      enum: ["Direct", "Agency"],
    },
    userType: {
      type: String,
      enum: ["admin", "manager", "admin manager", "executive"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    designation: {
      type: String,
    },
    deleted: {
      type: Boolean,
      deafult: false,
    },
  },
  { timestamps: true },
  { strict: "throw" }
);

export default mongoose.models.Users || mongoose.model("Users", userSchema);
