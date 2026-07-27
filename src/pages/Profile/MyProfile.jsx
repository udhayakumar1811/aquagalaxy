import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css";

function MyProfile() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
          setName(data.name);
          setEmail(data.email);
        } else {
          setMsg(data.message || "Failed to load profile");
        }
      } catch (err) {
        setMsg("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        localStorage.setItem("user", JSON.stringify(data));
        setIsEditing(false);
        setMsg("Profile updated successfully!");
      } else {
        setMsg(data.message || "Update failed");
      }
    } catch (err) {
      setMsg("Server error during update");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Account deleted successfully!");
          window.location.href = "/signup";
        } else {
          const data = await res.json();
          setMsg(data.message || "Failed to delete account");
        }
      } catch (err) {
        setMsg("Server error during deletion");
      }
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading Profile...</div>;

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2>My Profile</h2>
      {msg && <p style={{ color: "green", fontWeight: "bold" }}>{msg}</p>}

      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role || "user"}</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={() => setIsEditing(true)}>
              Edit Details
            </button>
            <button style={{ padding: "10px 15px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: "15px" }}>
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ padding: "10px 15px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ padding: "10px 15px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MyProfile;