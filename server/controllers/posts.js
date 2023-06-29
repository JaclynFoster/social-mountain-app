const { Post } = require('../models/post')
const { User } = require('../models/user')

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { privateStatus: false },
      include: [
        {
          model: User,
          required: true,
          attributes: [`username`]
        }
      ]
    })
    res.status(200).send(posts)
  } catch (error) {
    console.log('ERROR IN getAllPosts')
    console.log(error)
    res.sendStatus(400)
  }
}

const getCurrentUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.findAll({
      where: { userId: userId },
      include: [
        {
          model: User,
          required: true,
          attributes: ['username']
        }
      ]
    })
    res.status(200).send(posts)
  } catch (error) {
    console.log('error on getCurrentUserPosts: ', error)
    res.sendStatus(400)
  }
}

const addPost = async (req, res) => {
  try {
    const { title, content, status, userId } = req.body
    await Post.create({
      title: title,
      content: content,
      privateStatus: status,
      userId: userId
    })
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
    console.log('error on addPost', error)
  }
}

const editPost = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    await Post.update(
      { privateStatus: status },
      {
        where: { id: +id }
      }
    )
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
    console.log('error on editPost: ', error)
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    await Post.destroy({ where: { id: +id } })
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
    console.log('error on deletePost: ', error)
  }
}

module.exports = {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost
}
