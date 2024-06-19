const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const MenuItem = require("../models/MenuItemModel");
const Category = require("../models/CategoriesModel");

exports.getAllMenuItems = catchAsync(async (req, res, next) => {
  const menuItems = await MenuItem.find();
  res.status(200).json({
    status: "success",
    message: "All menu items retrieved successfully",
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});

exports.getMenuItem = catchAsync(async (req, res, next) => {
  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    return next(new AppError("No menu item found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Menu item retrieved successfully",
    data: {
      menuItem,
    },
  });
});

exports.createMenuItem = catchAsync(async (req, res, next) => {
  const { categoryId, options, ...menuItemData } = req.body;
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }
  const parsedOptions = options ? JSON.parse(options) : [];

  const menuItem = new MenuItem({
    ...menuItemData,
    options: parsedOptions,
    category: category._id,
  });

  if (req.file) {
    menuItem.image_url = req.file.path;
  }
  await menuItem.save();
  category.menuItems.push(menuItem._id);
  await category.save();
  res.status(201).json({
    status: "success",
    message: "Menu item created successfully",
    data: {
      menuItem,
    },
  });
});

exports.updateMenuItem = catchAsync(async (req, res, next) => {
  const { categoryId, options, ...menuItemData } = req.body;
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }
  const parsedOptions = options ? JSON.parse(options) : [];
  const menuItem = await MenuItem.findByIdAndUpdate(
    req.params.id,
    {
      ...menuItemData,
      options: parsedOptions,
      category: category._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!menuItem) {
    return next(new AppError("No menu item found with that ID", 404));
  }
  if (req.file) {
    menuItem.image_url = req.file.path;
  }
  res.status(200).json({
    status: "success",
    message: "Menu item updated successfully",
    data: {
      menuItem,
    },
  });
});

exports.deleteMenuItem = catchAsync(async (req, res, next) => {
  const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
  if (!menuItem) {
    return next(new AppError("No menu item found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    message: "Menu item deleted successfully",
    data: null,
  });
});

exports.getMenuItemsByCategory = catchAsync(async (req, res, next) => {
  const menuItems = await MenuItem.find({ category: req.params.categoryId });
  res.status(200).json({
    status: "success",
    message: "Get menu items by category successfully",
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});

exports.getMenuItemsByRating = catchAsync(async (req, res, next) => {
  const menuItems = await MenuItem.find({ rating: req.params.rating });
  res.status(200).json({
    status: "success",
    message: "Get menu items by rating successfully",
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});

exports.getMenuItemsByPrice = catchAsync(async (req, res, next) => {
  const menuItems = await MenuItem.find({ price: req.params.price });
  res.status(200).json({
    status: "success",
    message: "Get menu items by price successfully",
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});

exports.searchMenuItems = catchAsync(async (req, res, next) => {
  const menuItems = await MenuItem.find({
    name: { $regex: req.query.name, $options: "i" },
  });
  res.status(200).json({
    status: "success",
    message: "Menu items retrieved successfully",
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});
