const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MenuItem = require("./MenuItemModel");
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        note: {
          type: String,
          default: null,
        },
        options: [
          {
            _id: {
              type: Schema.Types.ObjectId,
              required: true,
            },
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
      },
    ],
    total_price: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    reservation_time: {
      type: Date,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  let totalPrice = 0;
  for (let i = 0; i < this.items.length; i++) {
    const menuItem = await MenuItem.findById(this.items[i].menuItem);
    let itemPrice = menuItem.price;
    for (let j = 0; j < this.items[i].options.length; j++) {
      itemPrice += this.items[i].options[j].price;
    }
    totalPrice += itemPrice * this.items[i].quantity;
  }
  this.total_price = totalPrice;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
