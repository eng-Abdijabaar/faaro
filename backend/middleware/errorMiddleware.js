const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode =
    err.statusCode ||
    err.status ||
    (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || "Internal server error";

  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with that value already exists";
  } else if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
  }

  if (statusCode >= 500) {
    console.error(err);

    if (process.env.NODE_ENV === "production") {
      message = "Internal server error";
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;