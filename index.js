const express = require("express");
const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors());

server.use("/user", require("./routes/user"));
server.use("/dashboard", require("./routes/dashboard"));

server.listen(3001, () => {
  console.log("Server running");
});
