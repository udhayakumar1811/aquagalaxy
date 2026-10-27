import { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle, FaMobileAlt, FaLock } from "react-icons/fa";
import udhayaLogo from "../../assets/udhaya-logo.png";

function Signup() {

  // Form Fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Stepper state: 1: Details & Send OTP, 2: Enter & Verify OTP, 3: Set Password
  const [step, setStep] = useState(1);
  const [verificationToken, setVerificationToken] = useState("");

  // Show / Hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend OTP timer effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Clean raw mobile to 10 digits
  const getCleanMobile = (val) => val.replace(/\D/g, "").slice(-10);

  // STEP 1: Send OTP to Mobile
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your full name");
      return;
    }

    const cleanMob = getCleanMobile(mobile);
    if (!cleanMob || cleanMob.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMob)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = API_URL ? API_URL.replace(/\/$/, "") : "";
      const res = await fetch(`${baseUrl}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleanMob, purpose: "registration" }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || `OTP sent to +91 ${cleanMob}`);
        setStep(2);
        setResendCooldown(60);
      } else {
        setErrorMsg(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setErrorMsg(err.message || "Unable to connect to server. Please check backend/network.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanMob = getCleanMobile(mobile);
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP received on your mobile");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = API_URL ? API_URL.replace(/\/$/, "") : "";
      const res = await fetch(`${baseUrl}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: cleanMob,
          otp: otp.trim(),
          purpose: "registration",
        }),
      });

      const data = await res.json();
      if (res.ok && data.verificationToken) {
        setVerificationToken(data.verificationToken);
        setSuccessMsg("Mobile verified successfully! Please set your account password.");
        setStep(3);
      } else {
        setErrorMsg(data.message || "Invalid OTP");
      }
    } catch (err) {
      setErrorMsg(err.message || "Unable to connect to server. Please check backend/network.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Complete Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (!verificationToken) {
      setErrorMsg("Mobile OTP verification is mandatory. Please restart verification.");
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const baseUrl = API_URL ? API_URL.replace(/\/$/, "") : "";
      const cleanMob = getCleanMobile(mobile);

      const res = await fetch(`${baseUrl}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          mobile: cleanMob,
          email: email.trim() || undefined,
          password,
          verificationToken,
        }),
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
        window.location.href = "/";
      } else {
        setErrorMsg(data.message || "Registration failed");
      }
    } catch (err) {
      setErrorMsg(err.message || "Unable to connect to server. Please check backend/network.");
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
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join UDHAYA AQUATICS for live ornamental fish & aquatic pets</p>

        {/* Step indicator */}
        <div className="auth-steps-bar">
          <span className={`auth-step-pill ${step === 1 ? "active" : "completed"}`}>1. Mobile</span>
          <span className={`auth-step-pill ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>2. OTP</span>
          <span className={`auth-step-pill ${step === 3 ? "active" : ""}`}>3. Password</span>
        </div>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}
        {successMsg && <div className="auth-success">{successMsg}</div>}

        {/* STEP 1: Enter Name, Mobile, Optional Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="auth-input-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="e.g. Udhayakumar"
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Mobile Number (For OTP Verification) *</label>
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
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <FaMobileAlt /> {loading ? "Sending OTP..." : "Send Verification OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: Enter 6-digit OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="auth-input-group">
              <label>
                Enter 6-Digit OTP sent to +91 {getCleanMobile(mobile)}
              </label>
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
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Set Password */}
        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="auth-form">
            <div className="auth-input-group">
              <label>Create Password *</label>
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

            <div className="auth-input-group">
              <label>Confirm Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Re-enter password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <FaLock /> {loading ? "Creating Account..." : "Complete Registration"}
            </button>
          </form>
        )}

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
