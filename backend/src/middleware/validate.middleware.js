import { ApiError } from "../utils/Api_Error.js";

const validate = (schema) => (req, res, next) => {
    try {
        const validData = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Replace req objects with validated and stripped data
        req.body = validData.body;
        req.query = validData.query;
        req.params = validData.params;

        next();
    } catch (error) {
        const errorMessage = error.errors
            ?.map((details) => details.message)
            .join(", ");
        next(new ApiError(400, errorMessage || "Validation Error", null, error.errors));
    }
};

export { validate };
