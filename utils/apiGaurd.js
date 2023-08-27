import { getSession } from "next-auth/react";
import createHttpError from "http-errors";
import httpStatusCodes from "./httpStatusCodes";

export default async function apiGaurd(req, res) {
  if (req.url.startsWith("/api/customer/private/")) {
    const session = await getSession({ req });
    if (!session) {
      throw createHttpError(
        httpStatusCodes.UNAUTHORIZED,
        "You are not authorized!"
      );
    }
  }
}
