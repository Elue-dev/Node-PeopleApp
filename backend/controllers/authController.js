// const path = require("path");
const crypto = require("crypto");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendErrorResponse } = require("../utils/response");
const { mailTransport } = require("../utils/mail");
const {
  resetPasswordTemplate,
  WelcomeMail,
  verificationEmail,
  userVerificationEmail,
} = require("../utils/mailTemplate");
const AppError = require("../utils/appError");
const app = require("../app");

app.set("views", `${__dirname}/../views`);
app.set("view engine", "ejs");

const generateToken = (id) => {
  let token;
  token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const createAndSendToken = (user, statusCode, res) => {
  // recieves, payload(id), secret and options
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, //only be sent to an encrypted connection, i.e when we using https
    httpOnly: true, //ca only be modified in http i.e can't be accessed or modified by the browser
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.confirmPassword = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { username, email, password, role, confirmPassword } = req.body;

  const newUser = await User.create({
    username,
    email,
    password,
    role,
    confirmPassword,
  });

  if (!req.body) {
    return sendErrorResponse(
      res,
      400,
      "Please enter the details of the user you want to sign up with"
    );
  }

  createAndSendToken(newUser, 200, res);

  let token = generateToken(newUser._id);

  mailTransport().sendMail({
    from: "mail@gmail.com",
    to: email,
    subject: "Verify your email address",
    html: verificationEmail(
      newUser.username,
      newUser.email,
      token,
      newUser._id
    ),
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendErrorResponse(res, 400, "Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return sendErrorResponse(res, 400, "Invalid email or password");
  }

  const token = generateToken(user._id);

  if (!user.isVerfied) {
    return res.status(400).json({
      status: "fail",
      message: "Your email is yet to be verified. Verify your email proceeding",
      verificationLink: `http://localhost:8000/api/auth/verify-email/${token}/${user._id}`,
    });
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return sendErrorResponse(res, 400, "Invalid email or password");
  }

  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  const correctPassword = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );

  if (!correctPassword) {
    return res.send("Incorrect password");
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createAndSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: Number(new Date(Date.now() * 10 * 1000)),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  //get user based on posted email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return sendErrorResponse(res, 404, "No user with that email exists");

  //generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send back email to user
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/reset-password/${resetToken}/${user._id}`;

  try {
    mailTransport().sendMail({
      from: "mail@gmail.com",
      to: email,
      subject: "Your password reset token, Valid for 10 minutes",
      html: resetPasswordTemplate(email, resetToken, user._id, user.username),
    });

    res.status(200).json({
      status: "success",
      token: resetToken,
      userId: user._id,
      message: "A password reset token has been sent to your email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return sendErrorResponse(res, 500, error);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //we will also check if passwordResetExpires is greater than now
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({
      status: "fail",
      message: "Password Reset Token is Invalid or has Expired",
    });
    return next();
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Passwords do not match",
    });
  }

  // 2) if token has not expired, and there is a user, the set new password
  //set whatever user sends as new password and confirm password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  //delete password reset token and expired
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save(); //we wont disable validation cuz we need it eg for password confirm

  // 3) update changedPasswordAt property for the user

  // 4) log user in, send jwt to client
  createAndSendToken(user, 200, res);
});

exports.verifyUser = catchAsync(async (req, res) => {
  const correctToken = jwt.verify(req.params.token, process.env.JWT_SECRET);

  if (!correctToken) {
    return res.status(400).json({
      status: "fail",
      message:
        "Verification token not valid. Use the verification link sent to your email.",
    });
  }

  const user = await User.findByIdAndUpdate(req.params.userId, {
    isVerfied: true,
  });

  mailTransport().sendMail({
    from: "mail@gmail.com",
    to: user.email,
    subject: "Welcome to the People's Family!",
    html: WelcomeMail(user.username),
  });

  await user.save();

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // res.status(200).json({
  //   status: "success",
  //   message: "Email verified successfully",
  // });

  res.render("index");
});

exports.sendVerificationToken = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  const token = generateToken(user._id);

  mailTransport().sendMail({
    from: "mail@gmail.com",
    to: user.email,
    subject: "Verify your email address",
    html: verificationEmail(user.username, user.email, token, user._id),
  });

  res.status(200).json({
    status: "success",
    message: "Verification link has been sent to your email",
  });
});
