const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]*$/.test(v);
        },
        message: (props) => `${props.value} is not a valid category name!`,
      },
    },
    description: {
      type: String,
      required: true,
    },
    menuItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],
  },
  { timestamps: true }
);

categorySchema.pre("remove", async function (next) {
  const menuItems = await this.model("MenuItem").find({ category: this._id });
  if (menuItems.length > 0) {
    next(new Error("This category has menu items. Please delete them first."));
  } else {
    next();
  }
});
module.exports = mongoose.model("Category", categorySchema);
