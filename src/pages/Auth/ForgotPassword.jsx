import { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaMobileAlt, FaCheckCircle, FaLock } from "react-icons/fa";
import udhayaLogo from "../../assets/udhaya-logo.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: New Password, 4: Success
  const [verificationToken, setVerificationToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const cleanMobile = (val) => val.replace(/\D/g, "").slice(-10);

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const mob = cleanMobile(mobile);
    if (!mob || mob.length !== 10 || !/^[6-9]\d{9}$/.test(mob)) {
      setErrorMsg("Please enter a valid 10-digit registered Indian mobile number");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = API_URL ? API_URL.replace(/\/$/, "") : "";
      const res = await fetch(`${baseUrl}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mob, purpose: "forgot_password" }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || `Password reset OTP sent to +91 ${mob}`);
        setStep(2);
        setResendCooldown(60);
      } else {
        setErrorMsg(data.message || "Failed to send reset OTP");
      }
    } catch (err) {
      setErrorMsg(err.message || "Unable to connect to server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const mob = cleanMobile(mobile);
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = API_URL ? API_URL.replace(/\/$/, "") : "";
      const res = await fetch(`${baseUrl}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mob,
          otp: otp.trim(),
          purpose: "forgot_password",
        }),
      });

      const data = await res.json();
      if (res.ok && data.verificationToken) {
        setVerificationToken(data.verificationToken);
        setSuccessMsg("OTP verified! Please set your new password.");
        setStep(3);
      } else {
        setErrorMsg(data.message || "Invalid OTP");
      }
    } catch (err) {
      setErrorMsg(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 6) {
      setErrorMsg("New password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = API_URL ? API_URL.replace(/\/$/, "") : "";
      const mob = cleanMobile(mobile);

      const res = await fetch(`${baseUrl}/api/users/reset-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mob,
          verificationToken,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(4);
      } else {
        setErrorMsg(data.message || "Failed to reset password");
      }
    } catch (err) {
      setErrorMsg(err.message || "Unable to connect to server.");
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
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">
          {step === 4
            ? "Your password has been reset successfully!"
            : "Reset your account password via Mobile OTP"}
        </p>

        {step < 4 && (
          <div className="auth-steps-bar">
            <span className={`auth-step-pill ${step === 1 ? "active" : "completed"}`}>1. Mobile</span>
            <span className={`auth-step-pill ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>2. OTP</span>
            <span className={`auth-step-pill ${step === 3 ? "active" : ""}`}>3. New Password</span>
          </div>
        )}

        {errorMsg && <div className="auth-error">{errorMsg}</div>}
        {successMsg && <div className="auth-success">{successMsg}</div>}

        {/* STEP 1: Enter Mobile */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="auth-input-group">
              <label>Registered Mobile Number</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <span className="auth-phone-prefix">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <FaMobileAlt /> {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="auth-input-group">
              <label>Enter 6-Digit OTP sent to +91 {cleanMobile(mobile)}</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setErrorMsg("");
                }}
                placeholder="••••••"
                maxLength={6}
                autoFocus
                style={{ letterSpacing: "6px", fontSize: "20px", textAlign: "center", fontWeight: "700" }}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading || otp.length !== 6}>
              <FaCheckCircle /> {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px" }}
              >
                ← Change Number
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={resendCooldown > 0 || loading}
                style={{ background: "none", border: "none", color: resendCooldown > 0 ? "#94a3b8" : "#0077b6", fontWeight: "600", cursor: resendCooldown > 0 ? "not-allowed" : "pointer", fontSize: "13px" }}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="auth-input-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="At least 6 characters"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Re-enter new password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <FaLock /> {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}

        {/* STEP 4: Success Message */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <FaCheckCircle style={{ fontSize: "48px", color: "#10b981", marginBottom: "16px" }} />
            <p style={{ fontSize: "15px", color: "#334155", marginBottom: "20px" }}>
              Your password has been changed successfully. You can now log in with your new credentials.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="auth-btn"
            >
              Proceed to Login
            </button>
          </div>
        )}

        <p className="auth-footer-text">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

