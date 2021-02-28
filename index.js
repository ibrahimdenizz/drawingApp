const cors = require("cors");
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/client", express.static(__dirname + "/client"));

io.on("connection", (socket) => {
  console.log("connect");

  socket.on("draw", (drawPosition) => {
    io.emit("draw", drawPosition);
  });

  socket.on("finishedPosition", (finish) => {
    io.emit("finishedPosition", "finish");
  });
});

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

const port = process.env.PORT || 5000;

http.listen(port, () => {
  console.log(`Listening on ${port}`);
});
