import apiHandler from "../../../utils/api-handler";
import { findUserToSave } from "../../../services/db/userServices";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import httpStatusCodes from "../../../utils/httpStatusCodes";
import hashPassword from "../../../utils/hashPassword";

const change_password = async (req, res) => {
  const { email, id, newPassword, oldPassword, action } = req.body;
  //find user in DB
  let filter = email ? { email: email } : { _id: id };
  let user = await findUserToSave(filter);
  //if user found
  if (user) {
    //if request is change password
    if (action === "change_password") {
      //compare password and throw error if new and old password are same
      if (oldPassword === newPassword) {
        throw createHttpError(
          httpStatusCodes.BAD_REQUEST,
          "Old & New Password Cannot Be Same"
        );
      }
      //compare user old password with password saved in database
      const match = await bcrypt.compare(oldPassword, user.password);
      //if password matched
      if (match) {
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.save();
        res.status(httpStatusCodes.OK).json({
          message: "Password Changed Successfully",
        });
      } else {
        //through error if old password does not matched with  password saved in database
        throw createHttpError(
          httpStatusCodes.UNAUTHORIZED,
          "Wrong Old Password"
        );
      }
    }
    //if request is reset password
    if (action === "reset_password") {
      //check if new password same is old password
      const match = await bcrypt.compare(newPassword, user.password);
      //if not matched then change the save to database
      if (!match) {
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        res.status(httpStatusCodes.OK).json({
          message: "Password Changed Successfully",
        });
      } else {
        //if matched through error
        throw createHttpError(
          httpStatusCodes.BAD_REQUEST,
          "Old & New Password Cannot Be Same"
        );
      }
    }
  } else {
    //through error if user not found
    throw createHttpError(httpStatusCodes.NOT_FOUND, "User Not Found");
  }
};
export default apiHandler({ post: change_password });
