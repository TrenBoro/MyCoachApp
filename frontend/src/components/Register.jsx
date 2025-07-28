import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const newNavigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:8000/exercises/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful! Redirecting to login page.");
        setTimeout(() => newNavigate("/login"), 1000)
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (err) {
      setMessage("Network error.");
    }
  }

  return (
    <div className="register-form-container">  
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <div>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
        {message && <div>{message}</div>}
        <Link to="/login" className="login-link">
          Already have an account? Login.
        </Link>
      </form>
    </div>
  );
}