const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

exports.validateStudentData = (req, res, next) => {
  const student = req.body;
  const userNameParts = student.username.trim().split(" ");
  userNameParts.forEach((userPart) => {
    if (!/^[A-Za-z]+$/.test(userPart)) {
      return res
        .status(400)
        .json({ error: "Error: username must contain only characters" });
    }
  });

  // if (!/^[A-Za-z]+$/.test(student.username)) {
  //   return res
  //     .status(400)
  //     .json({ error: "Error: username must contain only characters" });
  // }

  // if (!/^[A-Za-z]+$/.test(student.lastName)) {
  //   return res
  //     .status(400)
  //     .json({ error: "Error: Last Name must contain only characters" });
  // }

  // const birthYear = new Date(student.birthday).getFullYear();
  // if (birthYear > new Date().getFullYear() - 16) {
  //   return res
  //     .status(400)
  //     .json({ error: "Error: Student must be at least 16 years old" });
  // }

  next();
};

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, role, group } = req.body;
  const query = { username };
  if (role === "student") {
    query.group = group;
  }

  const user = await User.findOne(query);
  if (user) {
    res.status(501).json({
      status: "fail",
      message: `User with username '${username}' ${
        role === "student" ? `in group ${group} ` : ""
      }already exists`,
    });
    //return next();
  }

  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

//?????
exports.checkForNewUsers = async (usersData) => {
  usersData.users.forEach(async (userData) => {
    const user = await User.findOne({ username: userData.username });
    if (!user) {
      await User.create({
        username: userData.username,
        password: userData.password,
        chats: [],
      });
    }
  });
};
