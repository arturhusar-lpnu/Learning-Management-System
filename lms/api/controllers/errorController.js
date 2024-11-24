const AppError = require("../utils/AppError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error");

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Use another`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log(err);
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in aggain", 401);

const handleTExpiredError = () =>
  new AppError("Your token has expired. Please log in aggain", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "err";
  sendErrorDev(err, res);
  //   if (process.env.NODE_ENV === "development") {
  //     sendErrorDev(err, res);
  //   } else if (process.env.NODE_ENV === "production") {
  //     let error = { ...err };

  //     if (error.name === "CastError") error = handleCastErrorDB(err);

  //     if (error.code === 11000) error = handleDuplicateFieldsDB(err);

  //     if (error.name === "ValidationError") error = handleValidationErrorDB(err);

  //     if (error.name === "JsonWebTokenError") error = handleJWTError();

  //     if (error.name === "TokenExpiredError") error = handleTExpiredError();

  //     sendErrorProd(error, res);
  //   }
};
