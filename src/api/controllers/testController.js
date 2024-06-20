const AppError = require("../utils/AppError");

exports.testFunction = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the restaurant API",
  });
};
