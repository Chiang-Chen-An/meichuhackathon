import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import { getCurrentUser, updateProfile, logout } from "../route/user";
import "./Profile.css";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCurrentUser();
      setUser(response);
      setEmail(response.email || "");
    } catch (error) {
      console.error("Load user profile failed:", error);
      if (error.message === "Not logged in") {
        navigate("/login");
      } else {
        setError(error.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!email && !password) {
      setError("Please provide at least email or password to update");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccessMessage("");

      const updateData = {};
      if (email && email !== user.email) {
        updateData.email = email;
      }
      if (password) {
        updateData.password = password;
      }

      if (Object.keys(updateData).length === 0) {
        setError("No changes to update");
        return;
      }

      const response = await updateProfile(updateData);

      if (response.logout) {
        setShowPasswordUpdateModal(true);
        return;
      }

      setSuccessMessage(response.message);

      await loadUserProfile();

      setPassword("");
      setConfirmPassword("");

      setShowUpdateForm(false);
    } catch (error) {
      console.error("Update profile failed:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirmModal(true);
  };

  const confirmLogout = async () => {
    try {
      setLoggingOut(true);
      setShowLogoutConfirmModal(false);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error.message || "Failed to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirmModal(false);
  };

  const handlePasswordUpdateConfirm = () => {
    setShowPasswordUpdateModal(false);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-content-page">
        <div className="loading-message">Loading profile...</div>
        <Navigation />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-content-page">
        <div className="error-message">
          Please login to view profile
          <button onClick={() => navigate("/login")} className="btn-primary">
            Go to login
          </button>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="profile-content-page">
      <div className="profile-header">
        <h2>{showUpdateForm ? "Update Profile" : "Profile"}</h2>
      </div>

      <div className="profile-container">
        {!showUpdateForm ? (
          <div className="user-info-compact">
            <div className="info-item">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user.user_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">
                {user.phone_number || "Not set"}
              </span>
            </div>
            <div className="info-item email-item">
              <span className="info-label">Email:</span>
              <div className="info-value email-wrap">
                {user.email || "Not set"}
              </div>
            </div>
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user.username || "Not set"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created:</span>
              <span className="info-value">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>

            <div className="button-group-compact">
              <button
                className="btn-primary btn-small"
                onClick={() => setShowUpdateForm(true)}
              >
                Update Profile
              </button>

              <button
                type="button"
                className="btn-danger btn-small"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="profile-form-compact">
            <div className="form-group-compact">
              <label className="form-label-compact">Email:</label>
              <input
                type="email"
                className="form-input-compact"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter new email"
              />
            </div>

            <div className="form-group-compact">
              <label className="form-label-compact">New password:</label>
              <input
                type="password"
                className="form-input-compact"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group-compact">
              <label className="form-label-compact">Confirm Password:</label>
              <input
                type="Password"
                className="form-input-compact"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>

            {error && <div className="error-message-compact">{error}</div>}
            {successMessage && (
              <div className="success-message-compact">{successMessage}</div>
            )}

            <div className="button-group-compact">
              <button
                type="submit"
                className="btn-primary btn-small"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={() => {
                  setEmail(user.email || "");
                  setPassword("");
                  setConfirmPassword("");
                  setError("");
                  setSuccessMessage("");
                  setShowUpdateForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {showPasswordUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✅ Update Successful</h3>
            </div>
            <div className="modal-body">
              <p>Password updated successfully!</p>
              <p>Please log in again for security.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary btn-small modal-btn"
                onClick={handlePasswordUpdateConfirm}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>⚠️ Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
              <p>You will be redirected to the home page.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-danger btn-small modal-btn"
                onClick={confirmLogout}
                disabled={loggingOut}
                style={{ marginRight: "6px" }}
              >
                {loggingOut ? "Logging out..." : "Confirm Logout"}
              </button>
              <button
                className="btn-secondary btn-small modal-btn"
                onClick={cancelLogout}
                disabled={loggingOut}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}

export default ProfilePage;
