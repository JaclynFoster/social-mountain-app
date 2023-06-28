const { sequelize } = require('./util/database')
const { User } = require('./models/user')
const { Post } = require('./models/post')
const express = require('express')
const cors = require('cors')
const app = express()
const { PORT } = process.env
const { login, register } = require('./controllers/auth')
const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost
} = require('./controllers/posts')
const { isAuthenticated } = require('./middleware/isAuthenticated')
const { Sequelize } = require('sequelize')
require('dotenv').config()

app.use(express.json())
app.use(cors())

User.hasMany
Post.belongTo

app.get(`/posts`, getAllPosts)
app.get(`/userposts/:userId`, getCurrentUserPosts)
app.post(`/register`, register)
app.post(`/login`, login)
app.post(`/posts`, isAuthenticated, addPost)
app.put(`/posts/:id`, isAuthenticated, editPost)
app.delete(`/posts/:id`, isAuthenticated, deletePost)

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  })
  .catch(err => console.log('Error on sequelize sync', err))


