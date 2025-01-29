const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (req, file, callback) => {
//     const extension = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync( async (req, res, next) => {
  if (req.file) {

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  }
});

const filterObj = (obj, ...allowedParams) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedParams.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// This method is for updating the user details other than the password.
exports.updateMe = catchAsync(async (req, res, next) => {
  // Check if user wants to update password and return error if he tries to do so.
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        400,
        'This route is for updating the user detils. If you want to update the password make a PATCH request on /updatePassword.',
      ),
    );
  }

  // update user details.
  const filteredObj = filterObj(req.body, 'name', 'email');
  if (req.file) filteredObj.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  // Return response.
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Do not delte the user permanantly rather just setting it's status inactive.
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: {},
  });
});

// Middleware for getting the id of the user without passing.
exports.setUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUser = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.addUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined, use /signup to create user.',
  });
});

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
