require('dotenv').config()
const jwt = require('jsonwebtoken')
const { SECRET } = process.env
// We are pulling our secret from .env so we do not show it in our code

module.exports = {
  isAuthenticated: (req, res, next) => {
    const headerToken = req.get('Authorization')
    // This is where we are checking for authentication of the token
    if (!headerToken) {
      // if there is no header token showing then there will be an authentication error
      console.log('ERROR IN auth middleware')
      res.sendStatus(401)
    }

    let token

    try {
      token = jwt.verify(headerToken, SECRET)
      // this is where the web token is verified
    } catch (err) {
      err.statusCode = 500
      throw err
    }

    if (!token) {
      // if there is no token this is where a 401 error will be given stating no token exists
      const error = new Error('Not authenticated.')
      error.statusCode = 401
      throw error
    }

    next()
  }
}
