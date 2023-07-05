require('dotenv').config()
const jwt = require('jsonwebtoken')
const { SECRET } = process.env
const bcrypt = require('bcryptjs')
const {User} = require('../models/user')

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
  console.log("User.findOne:", User.findOne)
  console.log("User:", User)
  try {
    const {username, password} = req.body
    let foundUser = await User.findOne({where: {username}})
    if (foundUser) {
        const isAuthenticated = bcrypt.compareSync(password, foundUser.hashedPass)

        if (isAuthenticated) {
            const token = createToken(foundUser.dataValues.username, foundUser.dataValues.id)
            const exp = Date.now() + 1000 * 60 * 60 * 48
            res.status(200).send({
                username: foundUser.dataValues.username,
                userId: foundUser.dataValues.id,
                token,
                exp
            })
        } else {
            res.status(400).send('unable to login')
        }

    } else {
        res.status(400).send('unable to login')
    }
} catch (error) {
    console.log("error register:",error)
    res.sendStatus(400)
}
}

const register = async (req, res) => {
  try {
    const { username, password } = req.body
    const foundUser = await User.findOne({ where: { username} })
    if (foundUser) {
      res.status(400).send('Username already exists')
    } else {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      const newUser = await User.create({
        username,
        hashedPass: hash
      })
      const token = createToken(
        newUser.dataValues.username,
        newUser.dataValues.id
      )
      console.log("Token:", token)
      console.log('newUser:', newUser)
      const exp = Date.now() + 1000 * 60 * 60 * 48
      res
        .status(200)
        .send({
          username: newUser.dataValues.username,
          userId: newUser.dataValues.id,
          token,
          exp
        })
    }
  } catch (error) {
    console.log('register error', error)
    res.sendStatus(400)
  }
}

module.exports = { login, register }

