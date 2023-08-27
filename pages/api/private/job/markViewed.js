import apiHandler from "../../../../utils/api-handler";
import { findJobWithoutLean } from "../../../../services/db/jobServices";
import validateRequest from "../../../../utils/yup-validator";
import { dynamicJobSchema } from "../../../../yup-schema/jobs";

const markViewed = async (req, res) => {
  const { id, type, assignID, transferID } = req.body;
  let body = req.body;

  let data = await validateRequest(body, dynamicJobSchema);
  if (data) {
    const job = await findJobWithoutLean({ _id: id });

    if (type === "assignTransferViewd") {
      job.assignment[job.assignment.length - 1].viewd = true;
      job.transfer[job.transfer.length - 1].viewd = true;
    }
    if (type === "assignViewd") {
      job.assignment[job.assignment.length - 1].viewd = true;
    }
    if (type === "TransferViewd") {
      job.transfer[job.transfer.length - 1].viewd = true;
    }

    const updatedJob = await job.save();

    res.status(200).json({
      updatedJob,
    });
  }
};

export default apiHandler({ put: markViewed });
