import apiHandler from "../../../utils/api-handler";
import { findUser } from "../../../services/db/userServices";

import httpStatusCodes from "../../../utils/httpStatusCodes";
import createHttpError from "http-errors";

import crypto from "crypto";
import sendEmail from "../../../utils/sendEmail";
import { createToken, removeToken } from "../../../services/db/tokenServices";

const resetPassword = async (req, res) => {
  const foundUser = await findUser(req.body);
   if (foundUser.role === "employee")
     throw createHttpError(
       httpStatusCodes.UNAUTHORIZED,
       "You are not allowed to change your password"
     );
  if (!foundUser.verified)
    throw createHttpError(
      httpStatusCodes.UNAUTHORIZED,
      "Your email is not verfied"
    );
  if (foundUser) {
    await removeToken({ userId: foundUser._id });
    let token = await createToken({
      userId: foundUser._id,
      token: crypto.randomBytes(32).toString("hex"),
      expiry: new Date().getTime() + 5 * 60 * 1000,
      purpose: "reset_password",
    });
    const url = `${process.env.BASE_URL}/auth/resetPassword/${foundUser._id}/${token.token}`;
    await sendEmail(
      foundUser.email,
      "Reset Your Password",
      url,
      "reset_password"
    );
    res.status(200).json({
      message: "ok",
    });
  } else {
    throw createHttpError(
      httpStatusCodes.BAD_REQUEST,
      "No account found associated with this account"
    );
  }
};
export default apiHandler({ post: resetPassword });
