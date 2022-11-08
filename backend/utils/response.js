const sendSuccessResponse = (res, statusCode, length, token, data) => {
  res.status(statusCode).json({
    status: "success",
    results: length || "",
    token: token,
    data: data,
  });

  data ? (data.password = undefined) : null;
};

const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    status: "fail",
    message: message,
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};
