const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stockRouter = require("./api/stocks.js");
const userRouter = require("./api/users.js");

const server = express();
dotenv.config();
const PORT = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/stocks", stockRouter);
server.use("/users", userRouter);

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
