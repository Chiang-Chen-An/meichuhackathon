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
  
  // 表單狀態
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
        // 如果未登入，跳轉到登入頁面
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
    
    // 驗證表單
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
      
      // 檢查是否需要重新登入（密碼更新的情況）
      if (response.logout) {
        // 顯示成功訊息的彈窗
        setShowPasswordUpdateModal(true);
        return;
      }
      
      setSuccessMessage(response.message);
      
      // 重新載入用戶資料
      await loadUserProfile();
      
      // 清空密碼欄位
      setPassword("");
      setConfirmPassword("");
      
      // 關閉更新表單
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
      // 登出成功後跳轉到首頁
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
            Go to Login
          </button>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="profile-content-page">
      <div className="profile-header">
        <h2>{showUpdateForm ? "更新個人資料" : "個人資料"}</h2>
      </div>

      <div className="profile-container">
        {!showUpdateForm ? (
          /* 用戶資訊顯示 */
          <div className="user-info-compact">
            <div className="info-item">
              <span className="info-label">用戶 ID:</span>
              <span className="info-value">{user.user_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">電話:</span>
              <span className="info-value">{user.phone_number || "未設定"}</span>
            </div>
            <div className="info-item email-item">
              <span className="info-label">電子郵件:</span>
              <div className="info-value email-wrap">{user.email || "未設定"}</div>
            </div>
            <div className="info-item">
              <span className="info-label">用戶名:</span>
              <span className="info-value">{user.username || "未設定"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">註冊時間:</span>
              <span className="info-value">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "未知"}
              </span>
            </div>
            
            <div className="button-group-compact">
              <button
                className="btn-primary btn-small"
                onClick={() => setShowUpdateForm(true)}
              >
                更新資料
              </button>
              
              <button
                type="button"
                className="btn-danger btn-small"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "登出中..." : "登出"}
              </button>
            </div>
          </div>
        ) : (
          /* 更新表單 */
          <form onSubmit={handleUpdateProfile} className="profile-form-compact">
            <div className="form-group-compact">
              <label className="form-label-compact">電子郵件:</label>
              <input
                type="email"
                className="form-input-compact"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="輸入新的電子郵件"
              />
            </div>

            <div className="form-group-compact">
              <label className="form-label-compact">新密碼:</label>
              <input
                type="password"
                className="form-input-compact"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="輸入新密碼"
              />
            </div>

            <div className="form-group-compact">
              <label className="form-label-compact">確認密碼:</label>
              <input
                type="password"
                className="form-input-compact"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次輸入新密碼"
              />
            </div>

            {error && <div className="error-message-compact">{error}</div>}
            {successMessage && <div className="success-message-compact">{successMessage}</div>}

            <div className="button-group-compact">
              <button
                type="submit"
                className="btn-primary btn-small"
                disabled={updating}
              >
                {updating ? "更新中..." : "更新"}
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
                取消
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 密碼更新成功彈窗 */}
      {showPasswordUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✅ 更新成功</h3>
            </div>
            <div className="modal-body">
              <p>密碼更新成功！</p>
              <p>請重新登入以確保安全。</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-primary btn-small modal-btn"
                onClick={handlePasswordUpdateConfirm}
              >
                前往登入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 登出確認彈窗 */}
      {showLogoutConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>⚠️ 確認登出</h3>
            </div>
            <div className="modal-body">
              <p>確定要登出嗎？</p>
              <p>登出後您將返回首頁。</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-danger btn-small modal-btn"
                onClick={confirmLogout}
                disabled={loggingOut}
                style={{ marginRight: '6px' }}
              >
                {loggingOut ? "登出中..." : "確認登出"}
              </button>
              <button 
                className="btn-secondary btn-small modal-btn"
                onClick={cancelLogout}
                disabled={loggingOut}
              >
                取消
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
