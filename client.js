const net = require("net");
var colors = require("colors");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promise function to handle readline-questions:
function askQuestion(question) {
  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

const main = async () => {
  const port = 3000;
  let username = await askQuestion("Enter username: ");

  if (username.length < 3) {
    username = "Anonymous User";
  }

  const address = await askQuestion("Enter address to connect to: ");

  const socket = new net.createConnection({ host: address, port: port });

  readline.on("line", (message) => {
    if (message === "quit") {
      socket.write(`${username} left the chat!`);
      socket.setTimeout(1000);
    } else {
      socket.write(`${username}: ${message}`);
    }
  });

  socket.on("connect", () => {
    console.log(
      `Server-message: Welcome to the Chat ${username}! Type 'quit' at any time to exit the chat.`
        .magenta
    );
    socket.write(`${username} joined the chat!`);
  });

  socket.on("data", (data) => {
    console.log(data.toString());
  });

  socket.on("timeout", () => {
    socket.write("quit");
    socket.end();
  });

  socket.on("end", () => {
    process.exit();
  });

  socket.on("error", () => {
    console.log(
      "An error occurred. The server either went offline. Or you entered an invalid IP, reconnect to try again!"
    );
  });
};

main();
