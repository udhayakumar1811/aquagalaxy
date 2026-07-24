import React, { useState } from "react";
import { API_URL } from "../../config";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Role Based Redirect
        if (data.user && data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        window.location.reload();
      } else {
        setErrorMsg(data.message || "Invalid Email or Password!");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg("Server error! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back to Aquafy</h2>
        <p className="auth-subtitle">Login to explore aquatic pets</p>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;