import { ApiError } from "../utils/Api_Error.js";

const validate = (validationFn) => (req, res, next) => {
  try {
    const result = validationFn(req.body, { ...req.query });
    if (result.body) req.body = result.body;
    next();
  } catch (error) {
    const message = Array.isArray(error)
      ? error.join(", ")
      : error.message || "Validation Error";
    next(new ApiError(400, message));
  }
};

export { validate };
