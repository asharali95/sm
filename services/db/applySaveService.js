import jobsModel from "../../models/jobs";
import userModel from "../../models/users";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import httpStatusCodes from "../../utils/httpStatusCodes";

export const applySave = async (userId, jobId, action, dashboard) => {
  const session = await mongoose.startSession();
  let updatedJob, updatedUser;
  try {
    session.startTransaction();
    if (action === "apply") {
      // Add the userId to the job's applicants array
      updatedJob = await jobsModel
        .findOneAndUpdate(
          { _id: jobId },
          { $addToSet: { applicants: { user: userId } } },
          { session, new: true }
        )
        .select("-applicants -company -draft");

      // Add the jobId to the user's appliedJobs array
      updatedUser = await userModel
        .findOneAndUpdate(
          { _id: userId },
          { $addToSet: { appliedJobs: jobId } },
          { session, new: true }
        )
        .select("savedJobs appliedJobs");
    } else if (action === "unapply") {
      // Add the userId to the job's applicants array
      updatedJob = await jobsModel
        .findOneAndUpdate(
          { _id: jobId },
          { $pull: { applicants: { user: userId } } },
          { session, new: true }
        )
        .select("-applicants -company -draft");

      // Add the jobId to the user's appliedJobs array
      if (dashboard) {
        updatedUser = await userModel
          .findOneAndUpdate(
            { _id: userId },
            { $pull: { appliedJobs: jobId } },
            { session, new: true }
          )
          .select("savedJobs appliedJobs")
          .exec();
      } else {
        updatedUser = await userModel
          .findOneAndUpdate(
            { _id: userId },
            { $pull: { appliedJobs: jobId } },
            { session, new: true }
          )
          .populate({
            path: "savedJobs",
            select: "-applicants -company -draft",
            model: "Jobs",
          })
          .populate({
            path: "appliedJobs",
            select: "-applicants -company -draft",
            model: "Jobs",
          })
          .select("savedJobs appliedJobs")
          .exec();
      }
    } else if (action === "save") {
      updatedUser = await userModel
        .findOneAndUpdate(
          { _id: userId },
          { $addToSet: { savedJobs: jobId } },
          { new: true }
        )
        .select("savedJobs appliedJobs");
    } else if (action === "unsave") {
      if (dashboard) {
        updatedUser = await userModel
          .findOneAndUpdate(
            { _id: userId },
            { $pull: { savedJobs: jobId } },
            { new: true }
          )

          .select("savedJobs appliedJobs")
          .exec();
      } else {
        updatedUser = await userModel
          .findOneAndUpdate(
            { _id: userId },
            { $pull: { savedJobs: jobId } },
            { new: true }
          )
          .populate({
            path: "savedJobs",
            select: "-applicants -company -draft",
            model: "Jobs",
          })
          .populate({
            path: "appliedJobs",
            select: "-applicants -company -draft",
            model: "Jobs",
          })
          .select("savedJobs appliedJobs")
          .exec();
      }
    } else if (action === "applyAndUnsave") {
      // Add the userId to the job's applicants array
      updatedJob = await jobsModel
        .findOneAndUpdate(
          { _id: jobId },
          { $addToSet: { applicants: { user: userId } } },
          { new: true, session }
        )
        .select("-applicants -company -draft");

      // Remove the jobId from the user's savedJobs array and Add the jobId to the user's appliedJobs array
      if (dashboard) {
        updatedUser = await userModel
          .findOneAndUpdate(
            { _id: userId },
            { $pull: { savedJobs: jobId }, $addToSet: { appliedJobs: jobId } },
            { new: true, session }
          )
          .select("savedJobs appliedJobs")
          .exec();
      } else {
        updatedUser = await userModel
          .findOneAndUpdate(
            { _id: userId },
            { $pull: { savedJobs: jobId }, $addToSet: { appliedJobs: jobId } },
            { new: true, session }
          )
          .populate({
            path: "savedJobs",
            select: "-applicants -company -draft",
            model: "Jobs",
          })
          .populate({
            path: "appliedJobs",
            select: "-applicants -company -draft",
            model: "Jobs",
          })
          .select("savedJobs appliedJobs")
          .exec();
      }
    } else if (action === "unapplyAndSave") {
      // remove the userId to the job's applicants array
      updatedJob = await jobsModel
        .findOneAndUpdate(
          { _id: jobId },
          { $pull: { applicants: { user: userId } } },
          { new: true, session }
        )
        .select("-applicants -company -draft");

      // add the jobId from the user's savedJobs array and remove the jobId to the user's appliedJobs array
      updatedUser = await userModel
        .findOneAndUpdate(
          { _id: userId },
          { $addToSet: { savedJobs: jobId }, $pull: { appliedJobs: jobId } },
          { new: true, session }
        )
        .populate({
          path: "savedJobs",
          select: "-applicants -company -draft",
          model: "Jobs",
        })
        .populate({
          path: "appliedJobs",
          select: "-applicants -company -draft",
          model: "Jobs",
        })
        .select("savedJobs appliedJobs")
        .exec();
    }

    await session.commitTransaction();

    if (dashboard) {
      return {
        result: {
          updatedUser,
          updatedJob,
        },
      };
    } else {
      return { result: updatedUser };
    }
  } catch (error) {
    await session.abortTransaction();
    createHttpError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Could not perform the desired action"
    );
  } finally {
    session.endSession();
  }
};
