const { list, create, getOne } = require("../services/post");

const listPosts = async (req, res) => {
  const posts = await list();
  res.send(posts);
};

const createPost = async (req, res) => {
  let postToCreate = {
    title: req.body.title,
    content: req.body.content,
  };

  const post = await create(postToCreate);
  res.status(201).send(post);
};

const getOnePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getOne(id);
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await getOne(req.params.id);

    if (req.body.title) {
      post.title = req.body.title;
    }

    if (req.body.content) {
      post.content = req.body.content;
    }

    await post.save();
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
}



module.exports = { listPosts, createPost, getOnePost, updatePost };
