class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    stack = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.stack =
      stack; /* The stack is a string that shows where the error happened in your code — it's called a stack trace. */
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
