const Notification = require("../models/notificationModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getUserNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const notifications = await Notification.find({ to: userId }).sort({
    createdAt: -1,
  });
  notifications.forEach((n) => n.populate("to"));
  res.status(200).json({
    status: "success",
    data: { notifications },
  });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const notificationId = req.params.id;
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId },
    { read: true }
  );
  res.status(200).json({
    status: "success",
    message: "updated successfully",
  });
});
