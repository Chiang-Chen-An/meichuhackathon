import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import Navigation from '../components/navigation';

function ProfilePage() {

  const saved_jobs = ['googoogaga', 'HAHA', 'AMD', 'google'];

  return (
    <div className="content-page">
      <h3>Saved works</h3>
      <div className="profile-info">
        
      </div>
      <Navigation/>
    </div>
  );
}

export default ProfilePage;