const express = require("express");
const authController = require("../middleware/authController");
const router = express.Router();
const orderController = require("../controllers/orderController");

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "staff"),
    orderController.getAllOrders
  )
  .post(authController.protect, orderController.createOrder);

router
  .route("/my-orders")
  .get(authController.protect, orderController.getAllMyOrders);

router
  .route("/my-orders/:id")
  .get(authController.protect, orderController.getMyOrder);
router
  .route("/:id")
  .get(authController.protect, orderController.getOrder)
  .patch(authController.protect, orderController.updateOrder)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.deleteOrder
  );
router.patch(
  "/:id/update-status",
  authController.protect,
  authController.restrictTo("admin", "staff"),
  orderController.updateOrderStatus
);
// cancel order
router.patch(
  "/:id/cancel",
  authController.protect,
  orderController.cancelOrder
);

module.exports = router;
