const express = require("express");
const Posts = require("../data/db.js");

const router = express.Router();

// POST - new post //
router.post("/", (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    Posts.insert(newPost)
      .then((post) => {
        res.status(201).json(newPost);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  }
});

// POST - new comment for specific post //
router.post("/:id/comments", (req, res) => {
  const commentInfo = req.body;
  const { id } = req.params;
  if (id !== commentInfo.post_id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else {
    if (!commentInfo.text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
    } else {
      Posts.insertComment(commentInfo)
        .then((comment) => {
          res.status(201).json(comment);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            error:
              "There was an error while saving the comment to the database.",
          });
        });
    }
  }
});

// GET - array of all posts //
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// GET - specific post //
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then((post) => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// GET - array of all comments on a specific post //
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findPostComments(id)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// DELETE - specific post //
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then((count) => {
      if (count > 0) {
        res
          .status(200)
          .json({ message: "The post has been deleted from our database" });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "The post could not be removed" });
    });
});

// PUT - update specific post //
router.put("/:id", (req, res) => {
  const changes = req.body;

  if (!changes.title || !changes.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
  Posts.update(req.params.id, changes)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
