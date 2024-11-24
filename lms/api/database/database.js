const mongoose = require("mongoose");
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n39p4xb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

exports.mongoConnect = (url) => {
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => console.log(err));
};

exports.mongoDisconnect = () => {
  mongoose
    .disconnect()
    .then(() => {
      console.log("Disconnected from DB");
    })
    .catch((err) => console.log(err));
};
