const express = require("express");
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");
const router = express.Router();

router
    .route("/")
    .get(categoryController.getAllCategories)
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        categoryController.createCategory
    );
module.exports = router;