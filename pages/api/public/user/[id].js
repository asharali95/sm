import apiHandler from "../../../../utils/api-handler";
import { findUser } from "../../../../services/db/userServices";
import httpStatusCodes from "../../../../utils/httpStatusCodes";
import createHttpError from "http-errors";

const getUser = async (req, res) => {
  const { id } = req.query;
  const foundUser = await findUser({ _id: id });

  if (foundUser) {
    res.status(200).json({
      ...foundUser,
    });
  } else {
    throw createHttpError(httpStatusCodes.NOT_FOUND, "User not found");
  }
};

export default apiHandler({ get: getUser });
