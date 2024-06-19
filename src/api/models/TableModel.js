const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tableSchema = new Schema(
  {
    table_number: {
      type: String,
      required: true,
      unique: true,
    },
    table_type: {
      type: String,
      required: true,
      enum: ["indoor", "outdoor", "vip"],
    },
    seats: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
    is_available: {
      type: Boolean,
      default: false,
    },
    qr_code: {
      type: String,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
