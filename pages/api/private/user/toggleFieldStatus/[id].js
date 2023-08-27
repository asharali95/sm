import apiHandler from "../../../../../utils/api-handler";
import { toggleStatus } from "../../../../../services/db/toggleFieldStatusService";
import httpStatusCodes from "../../../../../utils/httpStatusCodes";
import createHttpError from "http-errors";

const toggleFieldStatus = async (req, res) => {
  const { id } = req.query;
  const { jobId, action, field } = req.body;
  const result = await toggleStatus(id, jobId, action, field);
  if (result) {
    res.status(200).json({
      ...result,
    });
  } else {
    throw createHttpError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

export default apiHandler({ put: toggleFieldStatus });
