const AppError = require('../utils/appError');

const handleCastError = (err) =>
  new AppError(400, `Invalid ${err.path}: ${err.value}`);

const handleDuplicateKeyError = (err) => {
  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  return new AppError(400, `Duplicate field value ${key}: ${value}.`);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.properties.message);
  const message = `Invalid input data : ${errors.join('  ')}`;
  return new AppError(400, message);
};

const handleJwtError = () =>
  new AppError(401, 'Invalid token please login again.');

const handleJwtExpiredError = () =>
  new AppError(401, 'Token has expired..! please login again.');

const sendErrorDev = (err, req, res) => {
  // a) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // b) For Rendered website
  return res.status(res.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // a) API
  if (req.originalUrl.startsWith('/api')) {
    //Operational trusted error to send to the end user.
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown errors not to send to the end user.
    }
    // 1) log error.
    console.log('ERROR 💥 : ', err);

    // 2) send error.
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong...!',
    });
  }
  // b) For Rendered website
  //Operational trusted error to send to the end user.
  if (err.isOperational) {
    return res.status(res.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
    // Programming or other unknown errors not to send to the end user.
  }
  // 1) log error.
  console.log('ERROR 💥 : ', err);

  // 2) send error.
  return res.status(res.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal server error';

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };
    console.log(error);
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
    sendErrorProd(error, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
};
