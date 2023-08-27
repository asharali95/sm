import jobsModel from "../../models/jobs";

import mongoose from "mongoose";
export const toggleStatus = async (userId, jobId, action, field) => {
  let updatedJob;

  if (action === "addField") {
    let update;
    field === "addAll"
      ? (update = {
          $set: {
            "applicants.$[elem].publicFields": [
              "name",
              "lastName",
              "currentEmployer",
              "currentEmployment",
              "availableFrom",
              "about",
              "social",
              "phone",
              "address",
              "email",
            ],
          },
        })
      : (update = {
          $addToSet: { "applicants.$[elem].publicFields": field },
        });
    updatedJob = await jobsModel
      .findOneAndUpdate(
        { _id: jobId },
        {
          ...update,
        },
        {
          arrayFilters: [{ "elem.user": mongoose.Types.ObjectId(userId) }],
          new: true,
        }
      )
      .select("applicants");

    return {
      result: {
        ...updatedJob?.applicants?.filter((el) => el.user == userId),
      },
    };
  } else if (action === "removeField") {
    let update;
    field === "removeAll"
      ? (update = {
          $set: {
            "applicants.$[elem].publicFields": ["name"],
          },
        })
      : (update = { $pull: { "applicants.$[elem].publicFields": field } });
    updatedJob = await jobsModel
      .findOneAndUpdate(
        { _id: jobId },
        { ...update },
        {
          arrayFilters: [{ "elem.user": mongoose.Types.ObjectId(userId) }],
          new: true,
        }
      )
      .select("applicants");
    return {
      result: {
        ...updatedJob?.applicants?.filter((el) => el.user == userId),
      },
    };
  }
};
