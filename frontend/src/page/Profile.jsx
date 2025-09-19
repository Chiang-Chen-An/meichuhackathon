import React from 'react';
import './Profile.css';

function ProfilePage() {
  return (
    <div className="content-page">
      <h2 className="page-title">profile</h2>
      <div className="profile-info">
        <p><strong>name:</strong> unknownUser</p>
        <p><strong>Email:</strong> unkonUser@google.com</p>
        <button className="profile-button">Edit the profile</button>
        <button className="profile-button logout-button">log out</button>
      </div>
      <div className="auth-actions">
        <button className="auth-button">log in</button>
        <button className="auth-button">sign up</button>
      </div>
    </div>
  );
}

export default ProfilePage;