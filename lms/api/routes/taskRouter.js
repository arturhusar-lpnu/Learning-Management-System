const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.protect);

router.get("/:user_id", taskController.getAllTasks);
// router.post(
//   "/new-task/:user_id",
//   authController.restrictTo("admin", "teacher"),
//   taskController.addTask
// );
router.post(
  "/attach-task",
  authController.restrictTo("admin", "teacher"),
  taskController.attachTask
);
router.patch("/:id", taskController.updateTask);

module.exports = router;
