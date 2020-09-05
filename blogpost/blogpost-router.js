const express = require("express");

const blogpost = require("../data/db.js");

const router = express.Router();

// POST (create post) //
router.post("/", (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    blogpost
      .insert(newPost)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      });
  }
});

// POST (create comment for specific post) //
router.post("/:id/comments", (req, res) => {
  const commentInfo = req.body;
  const postId = parseInt(req.params.id);
  if (postId !== commentInfo.post_id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else {
    if (!commentInfo.text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
    } else {
      blogpost
        .insertComment(commentInfo)
        .then((comment) => {
          res.status(201).json({ data: comment });
        })
        .catch((error) => {
          console.log(error.message);
          res.status(500).json({
            error:
              "There was an error while saving the comment to the database",
          });
        });
    }
  }
});

// GET (all posts) //
router.get("/", (req, res) => {
  blogpost
    .find(req.query)
    .then((blogpost) => {
      res.status(200).json({ query: req.query, data: blogpost });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// GET (specific post) //
router.get("/:id", (req, res) => {
  const postId = req.params.id;
  blogpost
    .findById(postId)
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

// GET (all comments on specific post) //
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  blogpost
    .findPostComments(id)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200).json({ data: comments });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// DELETE (specific post) //
router.delete("/:id", (req, res) => {
  blogpost
    .remove(req.params.id)
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

// PUT (updates specific post) //
router.put("/:id", (req, res) => {
  const changes = req.body;

  if (!changes.title || !changes.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
  blogpost
    .update(req.params.id, changes)
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

// Export default router
module.exports = router;
