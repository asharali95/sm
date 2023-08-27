import { ValidationError } from "yup";
import createHttpError from "http-errors";
const mongoose = require("mongoose");

export default function errorHandler(err, res) {
  // Errors with statusCode >= 500 are should not be exposed
  if (createHttpError.isHttpError(err) && err.expose) {
    // Handle all errors thrown by http-errors module
    return res.status(err.statusCode).end(err.message);
  } else if (err instanceof ValidationError) {
    // Handle yup validation errors
    return res.status(400).end(err.errors.join(", "));
  } else if (err instanceof mongoose.Error.ValidationError) {
    //Handle mongoose validation error
    return res.status(400).end(err.message);
  } else if (err.name === "MongoError" && err.code === 11000) {
    //handle mongoDB error
    return res.status(409).end("Duplicate record found");
  } else {
    // default to 500 server error
    console.log(err.message)
    return res.status(500).end("Internal Server Error....");
  }
}
