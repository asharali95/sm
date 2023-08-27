import apiHandler from "../../../../utils/api-handler";
import {
  findUserAndUpdate,
  findUser,
} from "../../../../services/db/userServices";
import httpStatusCodes from "../../../../utils/httpStatusCodes";
import createHttpError from "http-errors";
import { dynamicUserSchema } from "../../../../yup-schema/user";
import validateRequest from "../../../../utils/yup-validator";
import mongoose from "mongoose";
import { findJobs } from "../../../../services/db/jobServices";

const editUser = async (req, res) => {
  const {
    query: { id },
  } = req;
  const objectID = mongoose.Types.ObjectId(id);
  let data = await validateRequest(req.body, dynamicUserSchema);

  if (req.body.hasOwnProperty("deleted")) {
    let jobs = await findJobs({
      $expr: {
        $eq: [
          mongoose.Types.ObjectId(id),
          { $arrayElemAt: ["$assignment.assignedTo", -1] },
        ],
      },
    });

    if (jobs.length > 0) {
      res.status(403).json({
        result: "Can not be deleted",
      });
      return;
    }
  }

  const foundUser = await findUser({
    _id: objectID,
  });

  if (foundUser) {
    const updatedUser = await findUserAndUpdate(objectID, data);

    const result = updatedUser._doc;
    delete result.password;
    if (updatedUser) {
      res.status(200).json({
        ...result,
      });
    } else {
      throw createHttpError(
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  } else {
    throw createHttpError(httpStatusCodes.NOT_FOUND, "User not found");
  }
};

export default apiHandler({ put: editUser });
