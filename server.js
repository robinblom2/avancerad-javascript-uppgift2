const net = require("net");
var colors = require("colors");

const PORT = 3000;
let connectedUsers = [];

const server = net.createServer((socket) => {
  connectedUsers.push(socket);
  console.log(`New user connected!`.green);

  socket.on("data", (data) => {
    broadcast(data, socket);
  });

  socket.on("close", () => {
    console.log("A user has left the chat!");
  });

  socket.on("error", (err) => {
    console.log("Connection Error.".red, err.code);
  });
});

const broadcast = (message, usedSocket) => {
  if (message.toString() === "quit") {
    const index = connectedUsers.indexOf(usedSocket); // Find the socket of the client that sent the message
    connectedUsers.splice(index, 1);
  } else {
    connectedUsers.forEach((socket) => {
      if (socket !== usedSocket) {
        socket.write(message);
      }
    });
  }
};

server.listen(PORT, () => {
  console.log(`Server listening on port:`, server.address().port);
});
