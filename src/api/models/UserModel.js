const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\+?[0-9]{7,15}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  img_avatar_url: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["staff", "client", "admin"],
    required: true,
    default: "client",
  },
  verificationCode: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
    default: 0,
  },
  discount_code: {
    type: String,
    default: null,
  },

  violations: {
    vaviolation_type: {
      type: String,
      enum: ["inappropriate", "spam", "harassment", "other"],
    },
    violation_description: {
      type: String,
    },
    violation_date: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
