const Task = require("../models/taskModel");
const AppError = require("../utils/AppError");
const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const userId = req.params.user_id;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    next(new AppError("No such user found with id: " + userId, 404));
    return;
  }
  let tasks;
  if (user.role === "student") {
    tasks = await Task.find({ assignedToGroup: user.group });
  } else {
    tasks = await Task.find({ assignedBy: user._id });
  }
  res.status(201).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

// exports.addTask = catchAsync(async (req, res, next) => {
//   const newTask = await Task.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       task: newTask,
//     },
//   });
// });

exports.updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTask) {
    return next(new AppError("No task with that ID", 404));
  }
  res.status(200).json({ status: "success", data: { task: updatedTask } });
});

exports.attachTask = catchAsync(async (req, res, next) => {
  // const { description, dueDate, studentId } = req.body;
  console.log(req.body, req.body.description);
  const { description, dueDate, group, name } = req.body;

  const students = await User.find({ group });

  // const student = await User.findById(studentId);
  // if (!student || student.role !== "student") {
  //   return next(new AppError(("Invalid student", 400)));
  // }

  const task = new Task({
    name,
    description,
    dueDate,
    assignedBy: req.user._id,
    assignedToGroup: group,
  });
  await task.save();
  students.forEach(async (student) => {
    await Notification.create({
      to: student,
      // from: req.user,
      // taskId: task._id,
      message: `New task ${task.description.substring(0, 10)}... from ${
        req.user.username
      }.`,
    });
    const io = req.app.get("io");
    io.to(student._id).emit("new-task", { task: task });
  });

  res.status(200).json({ status: "success", data: { task } });
});
