import apiHandler from "../../../../utils/api-handler";
import { createUser, findUser } from "../../../../services/db/userServices";
import hashPassword from "../../../../utils/hashPassword";
import httpStatusCodes from "../../../../utils/httpStatusCodes";
import createHttpError from "http-errors";
import { userSchema } from "../../../../yup-schema/user";
import validateRequest from "../../../../utils/yup-validator";
import crypto from "crypto";
import sendEmail from "../../../../utils/sendEmail";
import { createToken } from "../../../../services/db/tokenServices";

const registerUser = async (req, res) => {
  const { purpose, password } = req.body;
  delete req.body.purpose;
  let data = await validateRequest(req.body, userSchema);
  const foundUser = await findUser({ email: data.email });
  if (!foundUser) {
    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;
    const user = await createUser(data);
    let token = await createToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
      purpose: "verify_email",
    });

    let url;

    if (purpose === "verify_email_to_create_user") {
      url = `${process.env.BASE_URL}/auth/emailVerifyToCreateUser/${user._id}/${token.token}`;
    } else {
      url = `${process.env.BASE_URL}/auth/emailVerify/${user._id}/${token.token}`;
    }

    await sendEmail(
      user.email,
      "Verify Your Email Address",
      url,
      purpose ? purpose : "verify_email",
      undefined
    );

    res.status(201).json({
      message: "User has been created",
    });
  } else {
    throw createHttpError(
      httpStatusCodes.DUPLICATE_RECORD_FOUND,
      "Email already registerd"
    );
  }
};
export default apiHandler({ post: registerUser });
