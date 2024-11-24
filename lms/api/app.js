const express = require("express");
const cors = require("cors");
const AppError = require("./utils/AppError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const userRouter = require("./routes/userRouter.js");
const taskRouter = require("./routes/taskRouter.js");
const chatRoomRouter = require("./routes/chatRoomRouter.js");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(`${__dirname}/public/`));

app.use("/api/users/", userRouter);
app.use("/api/chats/", chatRoomRouter);
app.use("/api/tasks/", taskRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
