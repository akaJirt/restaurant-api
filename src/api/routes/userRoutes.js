const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const upload = require("../services/cloudinaryServices");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );

router
  .route("/delete-user")
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  );
  
router.route("/register").post(userController.registerUser);
router.route("/verify").post(userController.verifyEmail);
router.route("/login").post(userController.login);

router.route("/me").get(authController.protect, userController.getUser);
router
  .route("/update-me")
  .patch(
    authController.protect,
    upload.single("img_avatar_url"),
    userController.updateUser
  );
module.exports = router;
