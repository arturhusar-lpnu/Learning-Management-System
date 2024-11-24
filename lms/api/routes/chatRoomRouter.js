const express = require("express");
const roomController = require("../controllers/chatRoomController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.protect);

router.get("/", roomController.retrieveChatRooms);
router.get("/users", roomController.getAvailableUsers);
router.get("/:room/users", roomController.getAvailableUsers);
router.get("/:roomId/", roomController.joinRoom);
router.post("/new-room", roomController.createRoom);
router.put("/:room_name/new-message", roomController.addMessage);
router.put("/:room_name/new-user", roomController.addUser);

module.exports = router;
