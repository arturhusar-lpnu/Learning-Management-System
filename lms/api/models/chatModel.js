const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatRoomSchema = new Schema({
  roomName: {
    type: String,
    required: [true, "Provide a roomname"],
    unique: true,
    trim: true,
  },
  messages: [
    {
      content: String,
      userId: Schema.Types.ObjectId,
      username: String,
      timestamp: Date,
    },
  ],
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
chatRoomSchema.pre("remove", async (next) => {
  console.log("On remove");
  const chatId = this._id;

  try {
    await User.updateMany(
      { "chats.roomID": chatId },
      { $pull: { chats: { roomID: chatId } } }
    );

    next();
  } catch (error) {
    next(error);
  }
});
const ChatRoom = mongoose.model("Room", chatRoomSchema);

module.exports = ChatRoom;
