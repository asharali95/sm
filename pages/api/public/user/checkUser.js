import apiHandler from "../../../../utils/api-handler";
import { findUser } from "../../../../services/db/userServices";
const getUser = async (req, res) => {
  const result = await findUser(req.body);
  if (result) {
    delete result.password;
  }
  res.status(200).json({
    result,
  });
};
export default apiHandler({ post: getUser });
