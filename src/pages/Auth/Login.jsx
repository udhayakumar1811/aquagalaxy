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
        // 1. Save Token & User in LocalStorage 🚀
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || data));

        // 2. Navigate to Home Page (/) instead of Shop
        navigate("/");
        window.location.reload(); // Refresh header/navbar state
      } else {
        setErrorMsg(data.message || "Invalid Email or Password!");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg("Server error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back to Aquafy</h2>
        <p style={{ color: "#64748b", marginBottom: "20px" }}>
          Login to your account to explore aquatic pets
        </p>

        {errorMsg && <div className="error-alert">{errorMsg}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don't have an account? <Link to="/signup">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;