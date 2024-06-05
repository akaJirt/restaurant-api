const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/UserModel");
const { sendSMS } = require("../services/sendSMS");
const jwt = require("jsonwebtoken");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.registerUser = catchAsync(async (req, res, next) => {
  const { fullName, phoneNumber } = req.body;

  const user = await User.create({
    fullName,
    phoneNumber,
  });

  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  user.verificationCode = verificationCode;
  await user.save();

  await sendSMS(phoneNumber, verificationCode);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: {
      user,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new AppError("Please provide phone number!", 400));
  }
  const user = await User.findOne({ phoneNumber });

  if (!user) {
    return next(new AppError("User does not exist", 401));
  }

  if (!user.isVerified) {
    return next(new AppError("User is not verified", 401));
  }
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      token,
    },
  });
});

exports.verifyUser = catchAsync(async (req, res, next) => {
  const { phoneNumber, verificationCode } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.verificationCode !== verificationCode) {
    return next(new AppError("Invalid verification code", 400));
  }

  user.isVerified = true;
  user.verificationCode = null;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "User verified successfully",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
    data: null,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
