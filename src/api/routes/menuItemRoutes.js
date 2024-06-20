
const express = require("express");
const authController = require("../middleware/authController");
const upload = require("../services/cloudinaryServices");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");

router
  .route("/")
  .get(menuItemController.getAllMenuItems)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    upload.single("image_url"),
    menuItemController.createMenuItem
  );

router.route("/search").get(menuItemController.searchMenuItems);
router
  .route("/:id")
  .get(menuItemController.getMenuItem)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    upload.single("image_url"),
    menuItemController.updateMenuItem
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    menuItemController.deleteMenuItem
  );

router
  .route("/category/:categoryId")
  .get(menuItemController.getMenuItemsByCategory);

module.exports = router;
