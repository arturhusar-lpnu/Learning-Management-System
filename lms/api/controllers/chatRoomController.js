const ChatRoom = require("../models/chatModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");

exports.addUser = catchAsync(async (req, res, next) => {
  const roomName = req.params.room_name;
  const { userName } = req.body;
  const room = await ChatRoom.findOne({ roomName });

  if (!room) {
    return next(new AppError(`No such chat '${roomName}' exists`), 404);
  }
  const user = await User.findOne({ userName });
  if (!user) {
    return next(new AppError(`Wrong username : '${userName}'`), 404);
  }
  const isUserInRoom = room.participants.some((userId) =>
    userId.equals(user._id)
  );
  if (isUserInRoom) {
    return next(
      new AppError(`User '${userName}' is already in this chat`, 400)
    );
  }

  room.participants.push({ user });
  await room.save();

  await Notification.create({
    userId: user._id,
    chatId: room._id,
    message: `You are added to chat ${room.roomName}`,
  });
  const io = req.app.get("io");
  io.to(roomName).emit("user added to room", { user }); //
  const chatRoom = await room.populate("participants");
  res.status(200).json({
    status: "success",
    message: `User '${userName}' has been added to chat '${roomName}'`,
    data: { chat: chatRoom },
  });
});

exports.getAvailableUsers = catchAsync(async (req, res, next) => {
  const currUser = req.user;
  const roomId = req.params.room;

  const room = await ChatRoom.findOne({ _id: roomId });

  if (!room) {
    const users = await User.find({ _id: { $ne: currUser._id } });
    res
      .status(200)
      .json({ status: "success", data: { availableUsers: users } });
    return next();
  }
  const users = await User.find({ _id: { $ne: currUser._id } });

  const availableUsers = users.filter((user) => {
    const isParticipant = room.participants.find((participantId) =>
      participantId.equals(user._id)
    );

    return !isParticipant;
  });

  res.status(200).json({
    status: "success",
    data: { availableUsers: availableUsers.length > 0 ? availableUsers : [] },
  });
});

exports.createRoom = catchAsync(async (req, res, next) => {
  const { roomName, createdBy, members } = req.body;
  console.log("create Room- ");
  console.log(members);
  members.push(createdBy);
  const users = await User.find({
    _id: { $in: members.map((member) => member._id) },
  });
  let room = await ChatRoom.findOne({ roomName });
  if (room) {
    res
      .status(501)
      .json({ status: "fail", message: `chat '${roomName}' already exists` });
    return next();
  }
  room = new ChatRoom({
    roomName: roomName,
    messages: [],
    participants: users,
  });
  console.log("create Room- ");
  console.log(room);
  console.log("create Room- ");
  console.log(users);
  await Promise.all(
    users.map(async (user) => {
      // Create notification for each user
      await Notification.create({
        userId: user._id,
        chatId: room._id,
        message: `You are added to chat ${room.roomName}`,
      });

      user.chats.push(room);
      await user.save();
    })
  );
  await room.save();
  const chatRoom = await room.populate("participants");
  console.log(chatRoom);
  res.status(201).json({
    status: "success",
    message: "new room created",
    data: { chat: chatRoom },
  });
});

exports.joinRoom = catchAsync(async (req, res, next) => {
  const roomId = req.params.roomId;
  const room = await ChatRoom.findOne({ _id: roomId });
  if (!room) {
    return next(new AppError(`No such chat exists`), 404);
  }
  const chatRoom = await room.populate("participants");
  console.log(chatRoom);
  res.status(200).json({
    status: "success",
    data: { chat: chatRoom },
  });
});

exports.retrieveChatRooms = catchAsync(async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ status: "success", data: { chats: [] } });
  }
  const roomIds = user.chats.map((chat) => chat._id);
  const chatRooms = await ChatRoom.find({ _id: { $in: roomIds } }).populate(
    "participants"
  );

  res.status(200).json({ status: "success", data: { chats: chatRooms } });
});

exports.addMessage = catchAsync(async (req, res, next) => {
  const roomId = req.params.roomId;
  const { email, message } = req.body;
  const room = await ChatRoom.findOne({ _id: roomId });
  if (!room) {
    return next(new AppError(`No such chat exists`, 404));
  }

  const user = await User.findOne(email);
  if (!user) {
    return next(new AppError(`User with email '${email}' not found`, 404));
  }

  const newMessage = {
    content: message,
    userId: user._id,
    username: user.username,
    timestamp: new Date(),
  };

  room.messages.push(newMessage);
  await room.save();
  room.participants.forEach(async (participant) => {
    await Notification.create({
      to: participant.id,
      chatId: room._id,
      message: `New message ${message.substring(0, 10)}... from ${
        user.username
      } in chat ${room.roomName}`,
    });
  });
  const io = req.app.get("io");

  io.to(roomId).emit("newMessage", newMessage);
  res.status(200).json({
    status: "success",
    message: "Message sent successfully",
    newMessage,
  });
});
