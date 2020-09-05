const express = require("express");

const server = express();
server.use(express.json());

const postsRouter = require("./posts/posts-router.js");

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Welcome to the Node API 2 project!</h2>`);
});

module.exports = server;
