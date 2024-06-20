/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../middleware/authController");
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
