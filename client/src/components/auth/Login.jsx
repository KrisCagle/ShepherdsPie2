import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../managers/AuthManager"

export default function Login({ setLoggedInEmployee }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    setError("")

    login({ username, password })
      .then((employee) => {
        setLoggedInEmployee(employee)
        navigate("/")
      })
      .catch(() => {
        setError("Invalid username or password.")
      })
  }

  return (
    <div className="page">
      <div className="auth-card">
        <h1>Shepherd's Pies</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit">Log in</button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  )
}