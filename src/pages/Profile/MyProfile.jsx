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

  if (loading) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-heading">My Profile</h2>
        {msg && <p className="profile-message">{msg}</p>}

        {!isEditing ? (
          <div className="profile-card">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role || "user"}</p>

            <div className="profile-actions">
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                Edit Details
              </button>
              <button className="btn-delete" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleUpdate}>
            <div className="profile-form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="profile-form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-save">Save Changes</button>
              <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
