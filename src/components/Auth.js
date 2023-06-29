import { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../store/authContext'

const Auth = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [register, setRegister] = useState(true)

  const authCtx = useContext(AuthContext)
  console.log('username', username)
  console.log('password', password)
  const submitHandler = e => {
    e.preventDefault()
    axios
      .post(
        register
          ? `https://socialmtn.devmountain.com/register`
          : `https://socialmtn.devmountain.com/login`,
        {
          username,
          password
        }
      )
      .then(res => {
        authCtx.login(res.data.token, res.data.expiration, res.data.userId)
        console.log('Auth Response:', res.data)
      })
      .catch(err => {
        console.log('error on auth post request:', err)
        setUsername('')
        setPassword('')
        setRegister(false)
      })
    console.log('submitHandler called')
  }

  return (
    <main>
      <h1>Welcome!</h1>
      <form className="form auth-form" onSubmit={submitHandler}>
        <input
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="form-input"
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-input"
        />
        <button className="form-btn">{register ? 'Sign Up' : 'Login'}</button>
      </form>
      <button className="form-btn" onClick={() => setRegister(!register)}>
        Need to {register ? 'Login' : 'Sign Up'}?
      </button>
    </main>
  )
}

export default Auth

