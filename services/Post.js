const Post = require("../models/Post");

const list = async () => Post.find();

const create = async (data) => Post.create(data);

const getOne = async (id) => Post.findById(id);

module.exports = { list, create, getOne };
