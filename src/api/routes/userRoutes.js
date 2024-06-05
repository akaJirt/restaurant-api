const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router
  .route("/")
  .get(
    userController.protect,
    userController.restrictTo("admin"),
    userController.getAllUsers
  );
router.route("/register").post(userController.registerUser);
router.route("/verify").post(userController.verifyUser);
router.route("/login").post(userController.loginUser);
router.route("/me").get(userController.protect, userController.getMe);
module.exports = router;
