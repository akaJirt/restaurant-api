const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Category = require("../models/CategoriesModel");

// @desc Get all categories
// @route GET /api/v1/categories
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    message: "All categories retrieved successfully",
    results: categories.length,
    data: {
      categories,
    },
  });
});

// @desc Create a category
// @route POST /api/v1/categories
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: {
      category,
    },
  });
});

// @desc Get a category
// @route GET /api/v1/categories/:id
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Category retrieved successfully",
    data: {
      category,
    },
  });
});

// @desc Update a category
// @route PATCH /api/v1/categories/:id
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: {
      category,
    },
  });
});

// @desc Delete a category
// @route DELETE /api/v1/categories/:id
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }
  await category.remove();
  res.status(204).json({
    status: "success",
    message: "Category deleted successfully",
    data: null,
  });
});
