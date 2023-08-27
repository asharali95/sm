import apiHandler from "../../../../utils/api-handler";
import { createJob } from "../../../../services/db/jobServices";
import validateRequest from "../../../../utils/yup-validator";
import { jobSchema, dynamicJobSchema } from "../../../../yup-schema/jobs";

const postJob = async (req, res) => {
  let body = req.body;
  body.deadline = new Date(body.deadline);
  let data;
  if (body.isDraft) {
    data = await validateRequest(body, dynamicJobSchema);
  } else {
    data = await validateRequest(body, jobSchema);
  }
  if (data) {
    const job = await createJob(data);
    res.status(201).json({
      job,
    });
  }
};

export default apiHandler({ post: postJob });
