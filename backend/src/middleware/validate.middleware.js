import { ApiError } from "../utils/Api_Error.js";

const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({ body: req.body, query: { ...req.query } });

        if (parsed.body) req.body = parsed.body;

        next();
    } catch (error) {
        const errorMessage = error.errors
            ?.map((details) => details.message)
            .join(", ");
        next(new ApiError(400, errorMessage || "Validation Error", null, error.errors));
    }
};

export { validate };
