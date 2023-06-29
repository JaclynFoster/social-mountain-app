require('dotenv').config()
const jwt = require('jsonwebtoken')
const { SECRET } = process.env
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const createToken = credentials => {
  return jwt.sign(
    {
      id: credentials.id,
      username: credentials.username
    },
    SECRET,
    {
      expiresIn: '2 days'
    }
  )
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const foundUser = await User.findOne({ where: { username: username } })
    if (foundUser) {
      const isAuthenticated = bcrypt.compareSync(password, foundUser.hashedPass)
      if (isAuthenticated) {
        const token = createToken(
          newUser.dataValues.username,
          newUser.dataValues.id
        )
        const exp = Date.now() + 1000 * 60 * 60 * 48
      } else {
        res.status(400).send('Unable to locate user. Please try again.')
      }
    } else {
      res.status(400).send('Unable to locate user. Please try again.')
    }
  } catch {
    console.log('login error', error)
    res.sendStatus(400)
  }
}

const register = async (req, res) => {
  try {
    const { username, password } = req.body
    const foundUser = await User.findOne({ where: { username: username } })
    if (foundUser) {
      res.status(400).send('Username already exists')
    } else {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      const newUser = await User.create({
        username: username,
        hashedPass: hash
      })
      const token = createToken(
        newUser.dataValues.username,
        newUser.dataValues.id
      )
      console.log('newUser:', newUser)
      const exp = Date.now() + 1000 * 60 * 60 * 48
      res
        .status(200)
        .send({
          username: newUser.dataValues.username,
          userId: newUser.dataValues.id,
          token: token,
          exp: exp
        })
    }
  } catch (error) {
    console.log('register error', error)
    res.sendStatus(400)
  }
}

module.exports = { login, register }

