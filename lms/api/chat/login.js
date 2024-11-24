//
const userCont = $(".user");
const notificationBell = $("#page-header-notification");
const btnCloseLogin = $("#btn-close-login");
const login = $("#login");
const sing_up = $("#sign-up");
const btnLogin = $("#btn-login-user");
const btnToggleSignUpForm = $("#login-btn-signup-user");
const bntSignUp = $("#btn-sign-up-user");
let User = {
  _id: "",
  username: "",
  isJoined: false,
  loggedIn: false,
  messages: [],
};
const userList = [];
userCont.on("click", () => {
  openCloseModal(login);
});
btnCloseLogin.on("click", () => {
  $("#login-username").val("");
  $("#login-user-pass").val("");
  openCloseModal(login);
});

btnLogin.on("click", () => {
  User.username = $("#login-username").val();
  User.password = $("#login-user-pass").val();
  //if (!checkUser(User)) {
  //  notificationBell.addClass("hidden");
  //  return;
  //}
  socket.emit("login", User);
  //User.loggedIn = false;
  socket.on("user-logged-in", (userId) => {
    console.log(userId);
    User.loggedIn = true;
    User._id = userId;
    userList.push(User);
    console.log(User);
    const username = $("#page-header-username");

    username.text(User.username);
    userCont.toggleClass("authorized");
    notificationBell.removeClass("hidden");

    $("#login-username").val("");
    $("#login-user-pass").val("");

    login.addClass("hidden");
    overlay.addClass("hidden");
    console.log("Log in");
    console.log(User);
    socket.emit("request-rooms", User);
  });
});

btnToggleSignUpForm.on("click", () => {
  sing_up.removeClass("hidden");
});

$("#btn-close-sign-up").on("click", () => {
  sing_up.addClass("hidden");
  $("#sign-up-username").val("");
  $("#sign-up-user-pass").val("");
});

bntSignUp.on("click", () => {
  const newUser = {};
  newUser.username = $("#sign-up-username").val();
  newUser.password = $("#sign-up-user-pass").val();
  newUser.confirmationPassword = $("#sign-up-user-conf-pass").val();
  if (newUser.password !== newUser.confirmationPassword) {
    alert("Error: Passwords are not matching");
    return;
  }
  socket.emit("register user", newUser);
  socket.on("registred", (resp) => {
    if (resp.res == "error") {
      alert(`Error registrating user: ${resp.msg}`);
    } else {
      console.log(`User ${resp.user.username} registrated successfully`);
      sing_up.addClass("hidden");
    }
    $("#sign-up-username").val("");
    $("#sign-up-user-pass").val("");
  });
});

function openCloseModal(modal) {
  overlay.toggleClass("hidden");
  modal.toggleClass("hidden");
  clearFormFields();
}
