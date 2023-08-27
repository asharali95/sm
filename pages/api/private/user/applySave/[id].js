import apiHandler from "../../../../../utils/api-handler";
import { applySave } from "../../../../../services/db/applySaveService";
import httpStatusCodes from "../../../../../utils/httpStatusCodes";
import createHttpError from "http-errors";

const handleApplySave = async (req, res) => {
  const { id } = req.query;
  const { jobId, action, dashboard } = req.body;
  const result = await applySave(id, jobId, action, dashboard);
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

export default apiHandler({ put: handleApplySave });
