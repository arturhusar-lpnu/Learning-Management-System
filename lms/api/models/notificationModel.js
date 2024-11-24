const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  //from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  //chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  //taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
