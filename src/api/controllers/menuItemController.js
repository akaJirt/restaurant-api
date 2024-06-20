const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const MenuItem = require("../models/MenuItemModel");
const Category = require("../models/CategoriesModel");
const diacritics = require("diacritics");

// @desc Get all menu items
// @route GET /api/v1/menu-items
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

// @desc Get a menu item
// @route GET /api/v1/menu-items/:id
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

// @desc Create a menu item
// @route POST /api/v1/menu-items
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

// @desc Update a menu item
// @route PATCH /api/v1/menu-items/:id
exports.updateMenuItem = catchAsync(async (req, res, next) => {
  const { categoryId, options, ...menuItemData } = req.body;

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }
    menuItemData.category = category._id;
  }

  const parsedOptions = options ? JSON.parse(options) : [];
  const menuItem = await MenuItem.findByIdAndUpdate(
    req.params.id,
    {
      ...menuItemData,
      options: parsedOptions,
    },
    {
      new: true,
      runValidators: true,
      context: "query",
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
// @desc Delete a menu item
// @route DELETE /api/v1/menu-items/:id
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

// @desc Get menu items by category
// @route GET /api/v1/menu-items/category/:categoryId
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

// @desc Search menu items
// @route GET /api/v1/menuItems/search?name=name
exports.searchMenuItems = catchAsync(async (req, res, next) => {
  let searchQuery = req.query.name.replace(/-/g, " ");
  searchQuery = diacritics.remove(searchQuery).toLowerCase();
  const menuItems = await MenuItem.find({
    normalized_name: { $regex: searchQuery, $options: "i" },
  });
  res.status(200).json({
    status: "success",
    message: "Search menu items successfully",
    results: menuItems.length,
    data: {
      menuItems,
    },
  });
});
