const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  sendSuccessResponse(res, 200, users.length, users);
});

exports.getSingleUser = catchAsync(async (req, res) => {
  res.send("get single user");
});
