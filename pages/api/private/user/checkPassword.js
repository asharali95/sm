import apiHandler from "../../../../utils/api-handler";
import { findUser } from "../../../../services/db/userServices";
import bcrypt from "bcrypt";
const checkPassword = async (req, res) => {
  const { id, oldPassword } = req.body;
  const user = await findUser({ _id: id });
  if (user) {
    const match = await bcrypt.compare(oldPassword, user.password);
    if (match) {
      res.status(200).json({
        message: "MATCHED",
      });
    } else {
      res.status(200).json({
        message: "NOT MATCHED",
      });
    }
  } else {
    throw createHttpError(httpStatusCodes.NOT_FOUND, "User Not Found");
  }
};
export default apiHandler({ post: checkPassword });
