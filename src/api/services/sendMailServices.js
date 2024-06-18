const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.sendMail = catchAsync(async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, "../views"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "../views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Email Verification",
    template: "emailVerification",
    context: {
      verificationCode,
    },
  };

  await transporter.sendMail(mailOptions);
});
