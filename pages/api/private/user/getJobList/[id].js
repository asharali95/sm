import apiHandler from "../../../../../utils/api-handler";
import { findInterestAndSavedJobList } from "../../../../../services/db/userServices";
import httpStatusCodes from "../../../../../utils/httpStatusCodes";
import createHttpError from "http-errors";

const getJobList = async (req, res) => {
  const { id } = req.query;
  const foundList = await findInterestAndSavedJobList({
    _id: id,
  });
  if (foundList) {
    res.status(200).json({
      ...foundList,
    });
  } else {
    throw createHttpError(httpStatusCodes.NOT_FOUND, "Data not found");
  }
};

export default apiHandler({ get: getJobList });
