import dbConnect from "../lib/monogConnect";
import errorHandler from "./error-handler";
import apiGaurd from "./apiGaurd";
export default function apiHandler(handler) {
  return async (req, res) => {
    const method = req.method.toLowerCase();
    // check handler supports HTTP method
    if (!handler[method])
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    try {
      //Protect API
      await apiGaurd(req, res);
      //Connect to db
      await dbConnect();
      //API route handler
      await handler[method](req, res);
    } catch (err) {
      errorHandler(err, res);
    }
  };
}
