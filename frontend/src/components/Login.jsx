import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const newNavigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const result = await login(username, password);
    if (result.success) {
      setMessage("Login successfull. Redirecting.")
      setTimeout(() => newNavigate("/"), 500);
    } else {
      setMessage(`Login unsuccessfull. ${result.error}`);
    }
  }

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
        {message && <div>{message}</div>}
        <Link to="/register" className="register-link">
          Don't have an account? Register.
        </Link>
      </form>
    </div>
  );
}