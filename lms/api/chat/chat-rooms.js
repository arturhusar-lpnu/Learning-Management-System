const roomsCont = document.querySelector(".chat-rooms");
const btnNewChatroom = $("#btn-new-chat");
const chatRoomCont = $(".new-chat-room");
const availableUsersCont = document.querySelector(".selection-users");
//
const bntAddSelectedUsers = $("#btn-add-selected-users");
const bntAddToNewChat = $("#btn-add-member-new-chat-room");
const btnAddToSelectedChat = $("#btn-add-member-selcted-chat");
const selectUsersForm = $(".select-users");
const selectedUser = {
  username: "",
};
const selectionUsersContainer = $(".selection-users");
const selectedUsersListContainer = $(".selected-users-list");
const btnAddMembers = document.querySelectorAll(".btn-add-member");
const chatMembersListCont = document.querySelector(".selected-chat-members");
let container = "";
btnNewChatroom.on("click", () => {
  openCloseModal($(".new-chat-room"));
});
$("#btn-close-new-chat-room").on("click", () => {
  openCloseModal($(".new-chat-room"));
});
roomsCont.addEventListener("click", async (event) => {
  await toggleMembers(event);
});

btnAddToSelectedChat.on("click", () => {
  if (!User.loggedIn) {
    alert("log in first");
    return;
  }
  openCloseModal(selectUsersForm);
  socket.emit("fetch users", User, chatroom);
  socket.on("avaiable-users", (users) => {
    availableUsersCont.innerHTML = " ";
    console.log(users);
    users.forEach((user) => {
      if (user.username == User.username) {
        return;
      }
      outputAvailableUser(user);
    });
    container = $(".selected-chat-members");
  });
});

bntAddToNewChat.on("click", () => {
  if (!User.loggedIn) {
    alert("log in first");
    return;
  }
  openCloseModal(selectUsersForm);
  socket.emit("fetch users", User, " ");
  socket.on("avaiable-users", (users) => {
    availableUsersCont.innerHTML = " ";
    //console.log(users);
    users.forEach((user) => {
      if (user.username == User.username) {
        return;
      }
      outputAvailableUser(user);
    });
    container = $(".member-list");
  });
});

$("#btn-close-selected-users").on("click", () => {
  openCloseModal(selectUsersForm);
});
const users = [];
selectionUsersContainer.on("click", (event) => {
  const clickedUser = $(event.target).closest(".available-user");

  // Extract the username from the clicked user
  const username = clickedUser.find("span").text();
  users.push(username);
  // Log the extracted username
  console.log(username);

  // Create elements for the selected user
  const avatar = $("<div>").addClass("avatar");
  const image = $("<img>")
    .addClass("sender-image")
    .attr("src", "../img/user.png");
  const usernameElement = $("<span>").text(username);

  // Append the image and username to the avatar
  avatar.append(image, usernameElement);

  // Append the avatar to the selected users list container
  selectedUsersListContainer.append(avatar);

  // Remove the clicked user from its original container
  clickedUser.remove();
  //const clickedUser = $(event.target).find(".available-user");
  //selectedUser.username = clickedUser.find("span").text();
  //console.log(clickedUser.find("span").text());
  ////selectedUser.image = $(clickedUser).closest("img");
  //console.log();
  //const avatar = document.createElement("div");
  //avatar.classList.add("avatar");
  //const image = document.createElement("img");
  //image.classList.add("sender-image");
  //image.setAttribute("src", "../img/user.png");
  //const username = document.createElement("span");
  //username.textContent = $(clickedUser).closest("span").text();
  //avatar.appendChild(image);
  //avatar.appendChild(username);
  //selectedUsersListContainer.append(avatar);
  //
  //clickedUser.remove();
});
selectedUsersListContainer.on("dbclick", ".avatar", (e) => {
  const clickedUser = $(e.target).closest(".avatar");
  selectedUser.username = $(clickedUser).closest("div").text();
  selectedUser.image = $(clickedUser).closest("img");

  const user = document.createElement("div");
});

function createChatRoomC(room) {
  const chatRoom = document.createElement("div");
  chatRoom.classList.add("chat-room");
  const image = document.createElement("img");
  image.setAttribute("src", "../img/user.png");

  const roomname = document.createElement("span");
  roomname.textContent = room.roomname;
  roomname.classList.add("roomname");

  chatRoom.append(image);
  chatRoom.append(roomname);

  const chatRooms = document.querySelector(".chat-rooms");
  chatRooms.append(chatRoom);
}
socket.on("avaiable-users", (users) => {
  chatMembersListCont.innerHTML = " ";
  console.log(users);
  users.forEach((user) => {
    if (user.username == User.username) {
      return;
    }
    console.log(user.username);
    outputAddedUser(user, chatMembersListCont);
  });
});
socket.on("chat-members", (users) => {
  chatMembersListCont.innerHTML = " ";
  console.log(users);
  users.forEach((user) => {
    if (user.username == User.username) {
      return;
    }
    console.log(user.username);
    outputAddedUser(user, chatMembersListCont);
  });
});
bntAddSelectedUsers.on("click", () => {
  const selectedUsers = document
    .querySelector(".selected-users-list")
    .querySelectorAll(".avatar");
  if (!selectedUsers) {
    alert("Select users to add to chatroom");
    return;
  }
  const usernames = [];

  // Iterate over each .avatar element
  selectedUsers.forEach((avatar) => {
    // Find the <span> element within the avatar
    const usernameSpan = avatar.querySelector("span");
    // If a <span> element is found, add its text content to the usernames array
    if (usernameSpan) {
      userList.push({ username: usernameSpan.textContent });
      usernames.push(usernameSpan.textContent);
    }
  });
  socket.emit("add-users", usernames, chatroom);
  userList.forEach((user) => {
    outputAddedUser(user, container);
  });
  openCloseModal(selectUsersForm);
});
$("#btn-create-chat-room").on("click", () => {
  const room = {};
  room.name = $("#new-chat-room-chatname").val();
  room.type = $("#new-chat-type").val();

  const users = userList;

  socket.emit("create-room", room.name, users, User);
  //outputRoom(room);
  //outputRoom(room);
  openCloseModal($(".new-chat-room"));
});
// bntAddToNewChat.on("click", () => {
//   //socket.emit("add-users", users, roomname);
//   users.forEach((username) => {
//     const _user = { username: username };

//     outputAddedUser(_user, container);
//   });
// });

//socket.on("added-users", (users) => {
//users.forEach((user) => outputAddedUser(user));
//});
function outputAddedUser(user, container) {
  const avatar = document.createElement("div");
  const image = document.createElement("img");
  image.classList.add("sender-image");
  image.setAttribute("src", "../img/user.png");

  const username = document.createElement("span");
  username.textContent = user.username;
  avatar.appendChild(image);
  avatar.appendChild(username);
  avatar.classList.add("avatar");
  container.append(avatar);
}

function outputAvailableUser(user) {
  const availableUser = document.createElement("div");
  availableUser.classList.add("available-user");

  const image = document.createElement("img");
  image.classList.add("sender-image");
  image.setAttribute("src", "../img/user.png");

  const username = document.createElement("span");
  username.textContent = user.username;
  username.classList.add("roomname");
  availableUser.appendChild(image);
  availableUser.appendChild(username);
  //console.log(availableUser);
  availableUsersCont.appendChild(availableUser);
}
