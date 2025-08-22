const path = require('path');
const Express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const dashboardRouter = require('./routes/dashboardRoute');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const app = Express();

app.set('view engine', 'pug');

// Global middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with frontend URL
    credentials: true, // ✅ Important for cookies
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

// Serving static files.
app.use(Express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again later.',
});

// Limiting api requests in one hour.
app.use('/api', limiter);

// Set security http headers.
app.use(helmet());

// Data sanitization against NoSql query injection.
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent the parameter polutions.
// app.use(
//   xss({
//     whitelist: [
//       'duration',
//       'ratingsAverage',
//       'ratingsQuantity',
//       'maxGroupSize',
//       'difficulty',
//       'price',
//     ],
//   }),
// );

// Body parser, reading data from body into req.body.
app.use(Express.json({ limit: '10kb' }));

// Cookie parser to read data of cookies in requests.
app.use(cookieParser());

// Logging for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
    console.log('hello from middleware');
    console.log(req.cookies || {});
    next();
})

app.use('/api/v1.0/products', productRouter);
app.use('/api/v1.0/users', userRouter);
app.use('/api/v1.0/reviews', reviewRouter);
app.use('/api/v1.0/dashboard', dashboardRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   data: {
  //     Error: 'Invalid api request.',
  //     error_description: `Can not find resource for this segment ${req.originalUrl}`,
  //   },
  // });

  // usint error class
  // const err = new Error(
  //   `Can not find resource for this segment ${req.originalUrl}`,
  // );
  // err.status = 'fail';
  // err.statusCode = 404;

  next(
    new AppError(
      404,
      `Can not find resource for this segment ${req.originalUrl}`,
    ),
  ); // this will skip all the middlewares and will run the error handling middleware only.
});

// Error handling middleware.
app.use(errorHandler);

module.exports = app;
