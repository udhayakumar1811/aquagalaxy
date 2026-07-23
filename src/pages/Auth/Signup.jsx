import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer"; // 👈 check Footer import
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import "./Auth.css"; // 👈 CSS import



function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save user & token in LocalStorage
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/shop");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account 🚀</h2>
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <Footer /> {/* 👈 Fixed JSX tag here */}
    </>
  );
}

export default Signup;