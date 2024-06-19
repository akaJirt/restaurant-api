const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[\p{L}\s]+$/u.test(v);
        },
        message: (props) => `${props.value} is not a valid last name!`,
      },
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image_url: {
      type: String,
      default:
        "https://res.cloudinary.com/df44phxv9/image/upload/v1718730497/PRO2052/cn3v3pyau6atdqmet1dg.png",
    },
    rating: {
      type: Number,
      default: 0,
    },
    options: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
