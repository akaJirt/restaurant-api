const express = require("express");
const authController = require("../middleware/authController");
const router = express.Router();
const tableController = require("../controllers/tableController");

router
  .route("/")
  .get(authController.protect, tableController.getAllTables)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    tableController.createTable
  );

router
  .route("/:id/availability")
  .patch(
    authController.protect,
    authController.restrictTo("admin", "staff"),
    tableController.updateTableAvailability
  );
router
  .route("/:id")
  .get(
    authController.protect,
    authController.checkTableAvailability,
    tableController.getTable
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    tableController.updateTable
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tableController.deleteTable
  );

module.exports = router;
