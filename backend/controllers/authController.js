const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendErrorResponse } = require("../utils/response");

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
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, //only be sen`t to an encrypted connection, i.e when we using https
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

  try {
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
        "Please enter the details of the user you want to signup with"
      );
    }
    createAndSendToken(newUser, 200, res);
  } catch (error) {
    return sendErrorResponse(res, 400, error.message);
  }
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendErrorResponse(res, 400, "Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!user || !correctPassword) {
    return sendErrorResponse(res, 400, "Invalid email or password");
  }

  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  console.log("BODY", req.body);

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
