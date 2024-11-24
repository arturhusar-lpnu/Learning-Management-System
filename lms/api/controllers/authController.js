require("dotenv").config();
const AppError = require("../utils/AppError");
const User = require("../models/userModel.js");
const util = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync.js");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 //n days
  //   ),
  //   httpOnly: true,
  // };

  // res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token: token,
    data: {
      user: user,
    },
  });
};

//Remove later
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    group: req.body.group,
  });

  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return next(new AppError("Provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  console.log(password);
  if (!user || !(await user.correctPassword(password, user.password))) {
    console.log(await user.correctPassword(password, user.password));
    return next(new AppError("Incorect email or password", 401));
  }
  createSendToken(user, 200, res);
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
      new AppError("You are not logged in. Please log in to get access", 401)
    );
  }

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to the token does no longer exist", 401)
    );
  }

  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError("Password was recently changed. Log in again", 401)
  //   );
  // }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
};
