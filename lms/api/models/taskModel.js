const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  board: {
    type: String,
    enum: ["ToDo", "In Progress", "Done"],
    default: "ToDo",
  },
  name: {
    type: String,
    required: [true, "Provide a name of your task"],
    unique: true,
  },
  description: {
    type: String,
    minlength: 8,
    maxlength: 52,
  },
  dueDate: Date,
  assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
  assignedToGroup: { type: String },
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
