import { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { Link } from "react-router-dom";
import { ADMIN_TIER_ROLES } from "../../constants/roles";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import udhayaLogo from "../../assets/udhaya-logo.png";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("sessionExpired")) {
        const msg = params.get("msg");
        setInfoMsg(msg || "Your session has expired. Please log in again.");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setInfoMsg("");

    try {
      const baseUrl = API_URL ? API_URL.replace(/\/$/, "") : "";
      const res = await fetch(`${baseUrl}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: data._id,
            name: data.name,
            mobile: data.mobile,
            email: data.email,
            role: data.role,
          })
        );
        window.dispatchEvent(new Event("auth-changed"));

        // ADMIN CHECK & REDIRECT LOGIC
        if (ADMIN_TIER_ROLES.includes(data.role)) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        setErrorMsg(data.message || "Invalid mobile number/email or password");
      }
    } catch (err) {
      console.error("Login Fetch Error:", err);
      setErrorMsg(
        err.message || "Unable to connect to server. Please check backend/network."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={udhayaLogo} alt="UDHAYA AQUATICS" className="auth-brand-logo" />
        </Link>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to UDHAYA AQUATICS account</p>

        {infoMsg && (
          <div style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", fontWeight: "500" }}>
            {infoMsg}
          </div>
        )}

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-group">
            <label>Mobile Number or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="e.g. 9876543210 or name@example.com"
              required
              autoFocus
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginTop: "-6px" }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: "13px", color: "#0077b6", textDecoration: "none", fontWeight: "600" }}
            >
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            <FaSignInAlt /> {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup">Register with Mobile OTP</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
