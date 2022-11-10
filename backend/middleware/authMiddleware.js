const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const { sendErrorResponse } = require("../utils/response");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // const headers = req.headers.authorization;
  const headers = req.headers.cookie;

  // if (headers && headers.startsWith("Bearer")) {
  //   token = headers.split(" ")[1];
  // }

  if (headers) {
    token = req.headers.cookie.split("=")[1];
  }

  console.log("token", token);

  if (!token) {
    sendErrorResponse(res, 401, "You are not Authorized.");
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return sendErrorResponse(
      res,
      404,
      "The user with this token no longer exists"
    );
  }

  req.user = user;

  next();
});
