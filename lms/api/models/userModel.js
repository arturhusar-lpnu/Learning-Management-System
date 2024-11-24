const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Provide your username"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
  },
  photo: String,
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Provide a password"],
    minlength: 8,
    unique: true,
    trim: true,
    select: false,
  },
  chats: [{ roomId: Schema.Types.ObjectId }],
  group: {
    type: String,
    default: null,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (this.role === "student" && !this.group) {
    return next(new AppError("Students must belong to a group", 400));
  }
  if (this.role !== "student" && this.group) {
    this.group = null;
  }
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
