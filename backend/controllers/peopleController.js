const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const People = require("../models/peopleModel");

const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

exports.addPerson = catchAsync(async (req, res) => {
  if (!req.body) {
    return sendErrorResponse(
      res,
      400,
      "Please enter person data before proceeding"
    );
  }

  const person = await People.create(req.body);
  sendSuccessResponse(res, 200, person);
});

exports.getPeople = catchAsync(async (req, res) => {
  const people = await People.find();
  sendSuccessResponse(res, 200, people);
});

exports.getPerson = catchAsync(async (req, res, next) => {
  const person = await People.findById(req.params.personId);

  if (!person) {
    return sendErrorResponse(
      res,
      404,
      `No user with the id: ${req.params.personId} exists`
    );
  }

  sendSuccessResponse(res, 200, person);
});

exports.updatePerson = catchAsync(async (req, res, next) => {
  const person = await People.findByIdAndUpdate(req.params.personId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!person) {
    return next(
      new AppError(`No user with the id: ${req.params.personId} exists`, 400)
    );
  }

  sendSuccessResponse(res, 200, person);
});

exports.deletePerson = catchAsync(async (req, res) => {
  const person = await People.findByIdAndDelete(req.params.personId);

  if (!person) {
    return next(
      new AppError(`No user with the id: ${req.params.personId} exists`, 400)
    );
  }

  sendSuccessResponse(res, 200, person);
});
