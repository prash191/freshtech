const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { promisify } = require('util');

const signToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    user,
  });

};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    changedPasswordAt: req.body.changedPasswordAt,
  });

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password.'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError(401, 'Incorrect email address or password.'));
  }

  user.password = undefined;

  createAndSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + 10 * 1000
    ),
    httpOnly: true,
  };

  res.cookie('jwt', 'loggedOut', cookieOptions);

  res.status(200).json({status: 'success'});
}

exports.isLoggedIn = async (req, res, next) => {
  if(req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      const verifyJwt = promisify(jwt.verify);
      const payload = await verifyJwt(token, process.env.JWT_SECRET);

      // check if user still exist.
      const user = await User.findById(payload.id);
      if (!user) {
        return next();
      }

      // check if user changed the password after token issued.
      const passwordChanged = user.checkPasswordAt(payload.iat);
      if (passwordChanged) {
        return next();
      }

      // There is a logged in user so we are saving it in the locals.
      res.locals.user = user;
      return next();
    } catch(err) {
      return next();
    }
  }
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  // check if token is present or not
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1] ?? '';
  } else if(req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError(401, 'Token not sent with the request.'));
  }

  // verify token signature.
  const verifyJwt = promisify(jwt.verify);
  const payload = await verifyJwt(token, process.env.JWT_SECRET);

  // check if user still exist.
  const user = await User.findById(payload.id);
  if (!user) {
    return next(new AppError(401, 'User does not exist for the token.'));
  }

  // check if user changed the password after token issued.
  const passwordChanged = user.checkPasswordAt(payload.iat);
  if (passwordChanged) {
    return next(
      new AppError(401, 'Password is changed for the user after token issued.'),
    );
  }

  // check if a document is present for the payload
  req.user = user;
  res.locals.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide'], role = 'user'
    console.log(roles);
    console.log(req.user.role);

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          'You do not have permission to perform this operation.',
        ),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // find user by provided email address.
  console.log(req.body.email);
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(404, 'User does not find with this email address.'),
    );
  }
  // create the reset token.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // send the reset token in the email.
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1.0/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forgot your password please ignore this email.`;

  try {
    await sendEmail({
      email: 'psprashant192@gmail.com',
      subject: 'Your password reset token (valid for 10 minute).',
      message: message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to the email.',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        500,
        'There is some error while sending the mail. Please try again later!',
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get the user based on the token in reqest.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // Check if token is valid and there is user, then reset the password.
  if (!user) {
    return next(new AppError(400, 'Token is invalid or the token is expired!'));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Update the changePasswordAt property for the user.
  // Log in the use, send the JWT token.
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // Find the user with the email
  const user = await User.findOne({ email: req.user.email }).select(
    '+password',
  );
  if (!user) {
    return next(new AppError(400, 'User not found.'));
  }

  // check if the posted password is correct
  if (!(await user.checkPassword(req.body.password, user.password))) {
    return next(new AppError(400, "Provided current password doesn't match."));
  }

  // Chage the password.
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // sending token for the updated user password.
  createAndSendToken(user, 200, res);
});
