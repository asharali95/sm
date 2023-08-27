import { findToken, removeToken } from "../../../../services/db/tokenServices";
import {
  findUser,
  findUserAndUpdate,
} from "../../../../services/db/userServices";
import apiHandler from "../../../../utils/api-handler";

const verifyEmail = async (req, res) => {
  const [id, token] = req.query.verifyEmail;
  const user = await findUser({ _id: id });
  if (!user) return res.status(400).json({ message: "Invalid link" });
  const foundToken = await findToken({
    userId: id,
    token: token,
  });
  if (!foundToken) return res.status(400).json({ message: "Invalid link" });
  if (foundToken?.expiry < new Date().getTime())
    return res.status(400).json({ message: "Link Expired" });
  if (foundToken.purpose === "verify_email") {
    await findUserAndUpdate({ _id: id }, { verified: true });
  }
  await removeToken(foundToken._id);
  res.status(200).json({ message: "OK" });
};

export default apiHandler({ get: verifyEmail });
