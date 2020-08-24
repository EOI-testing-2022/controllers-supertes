const express = require("express");
const Post = require("./models/Post");
const router = express.Router();
const { listPosts, createPost, getOnePost, updatePost } = require("./controllers/Post");

router.get("/posts", listPosts);

router.post("/posts", createPost);

router.get("/posts/:id", getOnePost);

router.patch("/posts/:id", updatePost);

router.delete("/posts/:id", async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

module.exports = router;
