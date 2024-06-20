const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Tạo swagger cho model User
/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *   type: object
 *  required:
 *  - fullName
 * - email
 * - password
 */

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[\p{L}\s]+$/u.test(v);
        },
        message: (props) => `${props.value} is not a valid last name!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v);
        },
        message: (props) =>
          `Password must contain at least 8 characters, including uppercase, lowercase letters and numbers!`,
      },
    },
    img_avatar_url: {
      type: String,
      default:
        "https://res.cloudinary.com/df44phxv9/image/upload/v1718237515/PRO2052/frx8qlue8l1xjfiqty6k.png",
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
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
