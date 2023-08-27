import apiHandler from "../../../../utils/api-handler";
import {
  findJobAndUpdate,
  findJobs,
  removeJob,
} from "../../../../services/db/jobServices";
import validateRequest from "../../../../utils/yup-validator";
import { dynamicJobSchema } from "../../../../yup-schema/jobs";
import createHttpError from "http-errors";
import httpStatusCodes from "../../../../utils/httpStatusCodes";

const editJob = async (req, res) => {
  const { id } = req.query;
  let body = req.body;
  if (body.deadline) {
    body.deadline = new Date(body.deadline);
  }

  let data = await validateRequest(body, dynamicJobSchema);
  if (data) {
    const updatedJob = await findJobAndUpdate({ _id: id }, data);
    res.status(200).json({
      updatedJob,
    });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.body;
  const foundJob = await findJobs({ _id: id });
  if (foundJob[0].company.toString() === userId) {
    const removedJob = await removeJob({ _id: id });
    res.status(200).json({
      removedJob,
    });
  } else {
    createHttpError(
      httpStatusCodes.UNAUTHORIZED,
      "You are not authorized to delete this job"
    );
  }
};

export default apiHandler({ put: editJob, delete: deleteJob });
