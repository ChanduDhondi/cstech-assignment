require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

// routes
const appRoute = require("./routes/appRoute.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"));

app.use(express.json());
app.use(cors());

app.use("/api", appRoute);

server.listen(process.env.PORT || 8000, (req, res) => {
  console.log(`App is listening on `);
});
