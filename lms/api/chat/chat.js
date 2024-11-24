const socket = io("http://localhost:3000/");
const selectedChat = document.querySelector(".selected-chat");
const title = selectedChat.querySelector(".selected-chat-title");
const membersContainer = selectedChat.querySelector("Members");
let connectedToChatRoom = false;
let chatroom = "";
//on connecting to page
socket.on("connect", () => {
  // add outputing rooms
  socket.emit("update-users"); // add outputing users
  console.log("(Client) Connected");
});
//wadd
socket.on("rooms-response", (rooms) => {
  const chatRooms = document.querySelector(".chat-rooms");
  const _chatrooms = chatRooms.querySelectorAll(".chat-room");
  _chatrooms.forEach((div) => {
    div.parentNode.removeChild(div);
  });
  console.log(rooms);
  //output all rooms by default. and the new ones later
  rooms.forEach((room) => {
    outputRoom(room);
  });
});

socket.on("db-users", (users) => {
  console.log(users);
  //users.forEach((user) => {
  //  outputAvaiableUser(user);
  //});
});

function outputRoom(room) {
  const chatRoom = document.createElement("div");
  chatRoom.classList.add("chat-room");
  const image = document.createElement("img");
  image.classList.add("sender-image");
  image.setAttribute("src", "../img/user.png");
  const roomname = document.createElement("span");
  roomname.textContent = room.roomname;
  roomname.classList.add("roomname");

  chatRoom.append(image);
  chatRoom.append(roomname);

  const chatRooms = document.querySelector(".chat-rooms");
  chatRooms.append(chatRoom);
}
function outputAvaiableUser(user) {}
function outputAddedUser(user) {}
socket.on("connect_error", (err) => {
  console.log(err.message);
});

socket.on("disconnect", () => {
  User.isJoined = false;
  User.loggedIn = false;
  console.log("(Client) Disconnected");
});

const btnSendMessage = $("#btn-send-message");
function joinRoom(chatroom, user) {
  socket.emit("joinRoom", chatroom, user); //
  user.chatroom = chatroom;
  user.isJoined = true;
}

$("#btn-add-selected-users").on("click", () => {
  socket.emit("add-users-to-chat", users); //
});

socket.on("");
socket.on("user-connected", (user, room) => {
  console.log(
    `(${user.username}) connected to ${room} chat.\n(${user.username}) messages: [${user.messages}]`
  );
  //userList.push(user);
});

socket.on("user-disconnected", (user) => {
  console.log(`(${user.username}) disconnected from ${user.room} chat`);
  //userList.remove(user);
});

socket.on("chat-message", (user) => {
  //renderMessage("chat", user);
});

document.querySelector(".user-message").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    btnSendMessage.click();
  }
});

btnSendMessage.on("click", () => {
  if (!User.isJoined) {
    alert(`${User.username} join a room first`);
    return;
  }
  const _message = $(".user-message").val();
  if (_message.length == 0) {
    return;
  }
  // renderMessage("my", msg);
  socket.emit("send-chat-message", User.chatroom, _message, User);
  $(".user-message").val("");
});

socket.on("chat-history", (history) => {
  const chat = document.querySelector(".selected-chat");
  chatHistory = chat.querySelectorAll(".message-cont");
  chatHistory.forEach((msg) => {
    msg.parentNode.removeChild(msg);
  });
  history.sort((a, b) => a.timestamp - b.timestamp);
  history.forEach((message) => {
    console.log(message);
    renderMessage(message);
  });
});

socket.on("new-chat-message", (message) => {
  renderMessage(message);
});

function renderMessage(msg) {
  const chat = $(".selected-chat");
  console.log(msg);

  let type = msg.username == User.username ? "my" : "chat";

  //user image and name to display
  const avatar = document.createElement("div");
  avatar.classList.add("avatar");

  const username = document.createElement("div");
  username.textContent = msg.username == User.username ? "Me" : msg.username;

  const userimage = document.createElement("img");
  userimage.setAttribute("src", "/img/sender.png");
  userimage.classList.add("user-image");
  //filling up the avatar
  avatar.appendChild(userimage);
  avatar.appendChild(username);
  //message text
  const message = document.createElement("div");
  //message.classList.add(`${type}`);
  message.classList.add("message-text");
  message.textContent = msg.content;

  const messagecontainer = document.createElement("div");
  messagecontainer.classList.add("message");
  messagecontainer.appendChild(message);
  //div to place the message based on type
  const chatMessage = document.createElement("div");

  chatMessage.classList.add("message-cont");
  chatMessage.classList.add(`${type}`);
  //filling the message div
  if (type == "chat") {
    chatMessage.appendChild(avatar);
    chatMessage.appendChild(messagecontainer);
  } else {
    chatMessage.appendChild(messagecontainer);
    chatMessage.appendChild(avatar);
  }
  //adding message to chat
  chat.append(chatMessage);

  chat.scrollTop = chat.scrollHeight - chat.clientHeight;
}

async function toggleMembers(event) {
  if (!User.loggedIn) {
    alert("Logg in first");
    return;
  }
  const chats = document.querySelectorAll(".chat-room");
  chats.forEach((chat) => {
    chat.classList.remove("room-active");
  });
  if (!event.target.closest(".chat-room")) {
    return;
  }
  event.target.closest(".chat-room").classList.add("room-active");
  chatroom = event.target
    .closest(".chat-room")
    .querySelector("span").textContent;
  console.log();
  $(".selected-chat-room").text(`Chat Room ${chatroom}`);
  const username = $("#page-header-username");
  User.username = username.text();

  //chatroom = await findRoom(_chatroom);
  //if (!chatroom) {
  //  console.log(`No room ${_chatroom} found`);
  //  return;
  //}
  // console.log(chatroom);
  //joinRoom(chatroom, User);
  joinRoom(chatroom, User);
}

//function findRoom(roomname) {
//  socket.emit("findRoom", roomname);
//  let _room;
//  socket.on("found-room", (resp) => {
//    if (resp.res == "new room") {
//      return null;
//    }
//    room = resp.room;
//    console.log(`found ${room.room} : ${room._id}`);
//    return room;
//  });
//  return _room;
//}

function findRoom(roomname) {
  socket.emit("findRoom", roomname);
  return new Promise((resolve, reject) => {
    // Listen for the "found-room" event
    socket.on("found-room", (resp) => {
      if (resp.res === "new room") {
        resolve(null); // Resolve with null if it's a new room
      } else {
        const room = resp.room;
        console.log(`found ${room.room} : ${room._id}`);
        resolve(room); // Resolve with the found room object
      }
    });
  });
}
