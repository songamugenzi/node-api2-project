const express = require("express");

const blogpostRouter = require("./blogpost/blogpost-router.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`
  <h2>Lambda Blog API</h2>
  <p>Welcome to the Lambda Blog API</p>
  `);
});

server.use("/api/posts", blogpostRouter);

server.listen(4000, () => {
  console.log("\n*** Server running on http://localhost:4000 ***\n");
});
