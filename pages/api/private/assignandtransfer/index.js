import createHttpError from "http-errors";
import { findJobAndUpdate } from "../../../../services/db/jobServices";
import httpStatusCodes from "../../../../utils/httpStatusCodes";
import apiHandler from "../../../../utils/api-handler";
import mongoose from "mongoose";

export const handleAssignAndTransfer = async (req, res) => {
  const {
    assignedTo,
    assignOrder,
    transferOrder,
    transfarredTo,
    jobId,
    action,
    userId,
    userType,
  } = req.body;
  if (userType === "user") {
    createHttpError(
      httpStatusCodes.UNAUTHORIZED,
      "You are not allowed to assign/transfer job"
    );
  }
  let updatedJob;

  if (action === "assign") {
    //
    updatedJob = await findJobAndUpdate(
      { _id: jobId },
      {
        $push: {
          assignment: {
            assignedTo: mongoose.Types.ObjectId(assignedTo),
            assignedBy: mongoose.Types.ObjectId(userId),
            order: assignOrder,
          },
        },
      }
    );
  }
  if (action === "transfer") {
    //
    updatedJob = await findJobAndUpdate(
      { _id: jobId },
      {
        $push: {
          transfer: {
            transfarredTo: mongoose.Types.ObjectId(transfarredTo),
            transfarredBy: mongoose.Types.ObjectId(userId),
            order: transferOrder,
          },
          assignment: {
            assignedTo: mongoose.Types.ObjectId(assignedTo),
            assignedBy: mongoose.Types.ObjectId(userId),
            order: assignOrder,
          },
        },
      }
    );
  }

  res.status(200).json({ updatedJob });
};

export default apiHandler({ put: handleAssignAndTransfer });
