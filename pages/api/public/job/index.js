import apiHandler from "../../../../utils/api-handler";
import { findAllJobs } from "../../../../services/db/jobServices";

const getAlljobs = async (req, res) => {
  const { page, limit, isFuture } = req.query;

  let data = await findAllJobs(page, limit, isFuture);
  
  res.status(200).json({
    ...data, 
  });
};

export default apiHandler({ get: getAlljobs });
