import createHttpError from "http-errors";
import { createTransport } from "nodemailer";
import generateEmailTemplate from "./generateEmailTemplate";
import httpStatusCodes from "./httpStatusCodes";
const sendEmail = async (
  email,
  subject,
  url = undefined,
  purpose = undefined,
  text = undefined
) => {
  try {
    const transporter = createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_SERVER_USER,
      to: email,
      subject: subject,
      html: purpose ? generateEmailTemplate(url, email, purpose) : null,
      text: !purpose ? text : null,
    });
  } catch (error) {
    throw createHttpError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong,email not sent"
    );
  }
};

export default sendEmail;
