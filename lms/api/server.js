const dotenv = require("dotenv");
const http = require("http");
dotenv.config({ path: "../config.env" });
const db = require("./database/database.js");
const socketIo = require("./socket.js");
const app = require("./app.js");
const server = http.createServer(app);
const io = socketIo.getIo(server);

app.set("io", io);

db.mongoConnect();

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
