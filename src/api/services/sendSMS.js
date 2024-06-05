const User = require("../models/UserModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function formatPhoneNumber(phoneNumber) {
  if (phoneNumber.startsWith("0")) {
    return "+84" + phoneNumber.slice(1);
  }
  return phoneNumber;
}

exports.sendSMS = async (phoneNumber, verificationCode) => {
  try {
    phoneNumber = formatPhoneNumber(phoneNumber);
    await client.messages.create({
      body: `CODE: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  } catch (err) {
    console.error(err);
  }
};

