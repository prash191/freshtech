const validator = require('validator');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a user name.'],
    minLength: [4, 'A user name must have at least 4 characters.'],
    maxLength: [30, 'A user name must have less than 30 characters.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide a email.'],
    unique: [true, 'User email should be unique.'], // Email must be unique
    lowercase: true, // Converts email to lowercase before saving
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minLength: [6, 'Password should have at least 6 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password.'],
    validate: {
      // This only works for create or save.
      validator: function (el) {
        return el === this.password;
      },
      message: 'This is not matched with password.',
    },
  },
  changedPasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // changedPasswordAt should be set the time before issuing the token that's why we have decreased it by 1 second (it's just a hack).
  this.changedPasswordAt = Date.now() - 1000;
  next();
});

// We can add the filter in the userController but it will only run for the specific route so we need to add it as query middleware.
userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkPasswordAt = function (JwtTimeStamp) {
  if (this.changedPasswordAt) {
    const changePasswordTimestamp = this.changedPasswordAt.getTime() / 1000;
    if (changePasswordTimestamp > JwtTimeStamp) {
      return true;
    }
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(resetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
