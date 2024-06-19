const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Order = require("../models/OrderModel");
const Table = require("../models/TableModel");
const MenuItem = require("../models/MenuItemModel");
const User = require("../models/UserModel");

// @desc Create an order
// @route POST /api/v1/orders
exports.createOrder = catchAsync(async (req, res, next) => {
  const { table, items, reservation_time } = req.body;
  const tableDoc = await Table.findById(table);
  if (!tableDoc) {
    return next(new AppError("Table not found", 404));
  }
  const menuItems = await MenuItem.find({
    _id: { $in: items.map((item) => item.menuItem) },
  });

  let totalPrice = 0;
  for (let item of items) {
    const menuItem = menuItems.find(
      (menuItem) => menuItem._id.toString() === item.menuItem.toString()
    );
    if (!menuItem) {
      return next(new AppError("MenuItem not found", 404));
    }
    let itemTotalPrice = menuItem.price * item.quantity;

    if (item.options && item.options.length > 0) {
      const validOptions = [];
      for (let option of item.options) {
        const validOption = menuItem.options.id(option._id);
        if (!validOption) {
          return next(new AppError("Option not found", 404));
        }
        validOptions.push({
          _id: validOption._id,
          name: validOption.name,
          price: validOption.price,
        });
        itemTotalPrice += validOption.price * item.quantity;
      }
      item.options = validOptions;
    }

    totalPrice += itemTotalPrice;
  }

  const order = await Order.create({
    user: req.user._id,
    table,
    items,
    total_price: totalPrice,
    reservation_time,
  });

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

// @desc Get all orders
// @route GET /api/v1/orders
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    status: "success",
    message: "Get all orders successfully",
    results: orders.length,
    data: {
      orders,
    },
  });
});

// @desc Get all my orders
// @route GET /api/v1/orders/my-orders
exports.getAllMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    status: "success",
    message: "Get my orders successfully",
    results: orders.length,
    data: {
      orders,
    },
  });
});

// @desc Get my order
// @route GET /api/v1/orders/my-orders/:id
exports.getMyOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ user: req.user._id, _id: req.params.id });
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Get my order successfully",
    data: {
      order,
    },
  });
});

// @desc Get an order
// @route GET /api/v1/orders/:id
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Get order successfully",
    data: {
      order,
    },
  });
});

// @desc Update an order
// @route PATCH /api/v1/orders/:id
exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (
    order.status === "ready" ||
    order.status === "delivered" ||
    order.status === "cancelled"
  ) {
    return next(new AppError("You can't update this order because it's already ready, delivered or cancelled", 400));
  }

  let totalPrice = 0;
  for (let i = 0; i < order.items.length; i++) {
    const menuItem = await MenuItem.findById(order.items[i].menuItem);
    let itemPrice = menuItem.price;
    for (let j = 0; j < order.items[i].options.length; j++) {
      itemPrice += order.items[i].options[j].price;
    }
    totalPrice += itemPrice * order.items[i].quantity;
  }
  order.total_price = totalPrice;

  await order.save();
  res.status(200).json({
    status: "success",
    message: "Update order successfully",
    data: {
      order,
    },
  });
});

// @desc Update an order status
// @route PATCH /api/v1/orders/:id/update-status
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Update order status successfully",
    data: {
      order,
    },
  });
});

// @desc Delete an order
// @route DELETE /api/v1/orders/:id
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(204).json({
    status: "success",
    message: "Delete order successfully",
    data: null,
  });
});

// @desc Cancel an order
// @route PATCH /api/v1/orders/:id/cancel
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (
    order.status === "ready" ||
    order.status === "delivered" ||
    order.status === "cancelled"
  ) {
    return next(new AppError("You can't cancel this order because it's already ready, delivered or cancelled", 400));
  }
  order.status = "cancelled";
  await order.save();
  res.status(200).json({
    status: "success",
    message: "Cancel order successfully",
    data: {
      order,
    },
  });
});
