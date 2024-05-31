const AppError = require("../utils/AppError");

exports.testFunction = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "This is a test function",
  });
};
