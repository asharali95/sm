import apiHandler from "../../../../utils/api-handler";
import { findJob } from "../../../../services/db/jobServices";

const getJob = async (req, res) => {
  const { id } = req.query;
  let data = await findJob({ _id: id });

  res.status(200).json({
    ...data,
  });
};

export default apiHandler({ get: getJob });
