import React, { useState } from "react";
import { API_URL } from "../../config";
import { Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
          })
        );
        window.location.href = "/";
      } else {
        setErrorMsg(data.message || "Invalid Email or Password");
      }
    } catch (err) {
      setErrorMsg("Server error! Please wait while server wakes up.");
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

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="kumar123@gmail.com"
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Connecting Server... Please wait" : "Login"}
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