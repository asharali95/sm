import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    recruiter: {
      type: String,
    },
    recruiterWebsite: {
      type: String,
    },
    recruiterImage: {
      type: {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
      },
    },
    location: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", ""],
    },
    draft: {
      type: Boolean,
      default: false,
    },
    publish: {
      type: Boolean,
      default: true,
    },
    salary: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    vacancies: {
      type: Number,
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        publicFields: {
          type: [String],
          default: ["name"],
        },
      },
    ],
    summary: {
      type: String,
    },
    companyType: {
      type: String,
      enum: ["Direct", "Agency"],
    },
    contactPersonName: {
      type: String,
    },
    contactPersonEmail: {
      type: String,
    },
    contactPersonDesignation: {
      type: String,
    },
    contactPersonPhone: {
      type: String,
    },
    contactPersonLinkedIn: {
      type: String,
    },
    contactPersonImage: {
      type: {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
      },
    },
    isFuture: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    assignment: [
      {
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        assignedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        assignedOn: {
          type: Date,
          default: Date.now,
        },
        order: {
          type: Number,
        },
        viewd: {
          type: Boolean,
          default: false,
        },
      },
    ],

    transfer: [
      {
        transfarredTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        transfarredBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        transfarredOn: {
          type: Date,
          default: Date.now,
        },
        order: {
          type: Number,
        },
        viewd: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

jobSchema.index({ title: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ recruiter: 1 });
jobSchema.index({ "assignment.assignedTo": 1 });

export default mongoose.models.Jobs || mongoose.model("Jobs", jobSchema);
