import { DEBUG_MODE } from "../config";
import { ValidationError } from "Joi";
import CustomErrorHandler from "../services/CustomErrorHandler";
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "Internal Server Error",

    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };

  if ((err.instatnceof, ValidationError)) {
    statusCode = 422; //unprocessable request
    data = {
      message: err.message,
    };
  }

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(statusCode).json(data);
};

export default errorHandler;
