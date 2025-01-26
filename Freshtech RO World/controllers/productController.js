const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      (new AppError(400, 'Not an image! Please upload image only.'), false),
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeProductPhoto = catchAsync(async (req, res, next) => {
  console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
  if (!req.files.imageCover) return next();
  // Cover Image

  req.body.imageCover = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.imageCover}`);

  // Images
  // const images = req.files.images;
  // req.body.images = []

  // await Promise.all(
  //   images.map(async (image, i) => {
  //     const imageFilename = `product-${req.params.id}-${Date.now()}-${i+1}.jpeg`;

  //     await sharp(image.buffer)
  //       .resize(500, 500)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 90 })
  //       .toFile(`public/img/products/${imageFilename}`);

  //     req.body.images.push(imageFilename);
  //   }),
  // );

  next();
});

exports.aliasTopFiveProducts = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,ratingsAverage,price';
  next();
};

exports.getAllProducts = factory.getAll(Product);

exports.addProduct = factory.createOne(Product);

exports.getProduct = factory.getOne(Product, { path: 'reviews' });

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.0 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    //   {
    //     $match: { _id: { $ne: 'EASY' } },
    //   },
  ]);

  res.status(200).json({
    status: 'success',
    result: stats.length,
    data: stats,
  });
});

exports.getMonthlyStats = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const stats = await Product.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numProducts: { $sum: 1 },
        Products: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numProducts: -1 },
    },
    {
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: 'success',
    result: stats.length,
    data: stats,
  });
});

exports.getProductsWithin = catchAsync(async (req, res, next) => {
  // Get all the params here
  const { distance, latlng, unit } = req.params;

  // Get latitude and longitude
  const [lat, lng] = latlng.split(',');

  // Check for the lat and long if provided or not
  if (!lat || !lng) {
    return next(
      new AppError(
        400,
        'Please provide the latitude and logitude in format latitude,logitude',
      ),
    );
  }

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  console.log(distance, lat, lng, unit, radius);

  // Get products within range
  const products = await Product.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  // return the response
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products,
  });
});

exports.getProductDistances = catchAsync(async (req, res, next) => {
  // Get all the params here
  const { latlng, unit } = req.params;

  // Get latitude and longitude
  const [lat, lng] = latlng.split(',');

  // Check for the lat and long if provided or not
  if (!lat || !lng) {
    return next(
      new AppError(
        400,
        'Please provide the latitude and logitude in format latitude,logitude',
      ),
    );
  }

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  // Use aggregation pipeline to calculate the distances.
  const distances = await Product.aggregate([
    {
      // $geoNear should be the first aggreagation in the pipeline to work.
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  // return the response
  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: distances,
  });
});
