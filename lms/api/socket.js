const User = require("./models/userModel.js");
const Notification = require("./models/notificationModel.js");
const ChatRoom = require("./models/chatModel.js");
const socketIo = require("socket.io");

module.exports = {
  getIo: (server) => {
    const io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
      },
    });
    io.on("connection", (socket) => {
      console.log("Connected");
      socket.on("User logged in", (user) => {
        socket.join(user._id);
      });

      socket.on("joinRoom", (chatId) => {
        console.log("Joined Room");
        socket.join(chatId);
      });

      socket.on("sendMessage", async ({ roomId, email, message }) => {
        try {
          const room = await ChatRoom.findOne({ _id: roomId });
          if (!room) {
            console.log(`No such chat exists`);
            return;
          }
          console.log("sendMessage - room checked");

          const user = await User.findOne({ email });
          if (!user) {
            console.log(`User with email '${email}' not found`);
            return;
          }
          console.log("sendMessage - user checked");

          const newMessage = {
            content: message,
            userId: user._id,
            username: user.username,
            timestamp: new Date(),
          };

          room.messages.push(newMessage);
          await room.save();
          console.log("sendMessage - new message added to room");
          await Promise.all(
            room.participants.map(async (participant) => {
              if (participant._id.equals(user._id)) {
                console.log("Duplicate data");
                return;
              }

              const notification = await Notification.create({
                to: participant._id,
                chatId: room._id,
                message: `New message ${message.substring(0, 10)}... from ${
                  user.username
                } in chat ${room.roomName}`,
              });
              io.to(participant._id).emit("New notification", notification);
            })
          );

          console.log("sendMessage - added notifications");
          io.to(roomId).emit("newMessage", newMessage);

          console.log("sendMessage - new Message");
        } catch (error) {
          console.log(error.message);
        }
      });
    });
    return io;
  },
};
