import apiHandler from "../../../../utils/api-handler";
import { findJobs } from "../../../../services/db/jobServices";
import validateRequest from "../../../../utils/yup-validator";
import { dynamicJobSchema } from "../../../../yup-schema/jobs";
import mongoose from "mongoose";

const getJobsByEmloyer = async (req, res) => {
  let { company, id, userType, subOrdinates } = req.body;
  let jobs;
  if (userType === "admin" || userType === "admin manager") {
    jobs = await findJobs({ company });
  } else if (userType === "manager") {
    jobs = await findJobs({
      $expr: {
        $in: [
          { $arrayElemAt: ["$assignment.assignedTo", -1] },
          [...subOrdinates, id].map((el) => mongoose.Types.ObjectId(el)),
        ],
      },
    });
  } else if (userType === "executive") {
    jobs = await findJobs({
      $expr: {
        $eq: [
          mongoose.Types.ObjectId(id),
          { $arrayElemAt: ["$assignment.assignedTo", -1] },
        ],
      },
    });
  }

  res.status(200).json({
    jobs,
  });
  // }
};

export default apiHandler({ post: getJobsByEmloyer });
