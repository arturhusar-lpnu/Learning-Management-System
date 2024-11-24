const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const notificationController = require("../controllers/notificationController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get(
  "/notifications",
  authController.protect,
  notificationController.getUserNotifications
);

router.patch(
  "/notifications/update-status/:id",
  authController.protect,
  notificationController.updateStatus
);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    userController.validateStudentData,
    userController.createUser
  );

module.exports = router;
