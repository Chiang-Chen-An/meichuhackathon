import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('shop'); // Shop is the homepage

  const renderContent = () => {
    switch (activeTab) {
      case 'shop':
        return (
          <div className="content-page">
            <h2 className="page-title">searching for goods</h2>
            <div className="product-grid">
              <div className="product-card">
                <div className="product-image"></div>
                <p className="product-name">none</p>
                <p className="product-price">$0</p>
              </div>
              <div className="product-card">
                <div className="product-image"></div>
                <p className="product-name">none</p>
                <p className="product-price">$0</p>
              </div>
              <div className="product-card">
                <div className="product-image"></div>
                <p className="product-name">none</p>
                <p className="product-price">$0</p>
              </div>
            </div>
          </div>
        );
      case 'search':
        return (
          <div className="content-page">
            <h2 className="page-title">searching for goods</h2>
            <input type="text" placeholder="Enter keywords here to search..." className="search-input" />
            <button className="search-button">search</button>
            <p className="no-result-text">nothing be found</p>
          </div>
        );
      case 'profile':
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
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* logo or title */}
      <header className="app-header">
        <h1>MicroShop</h1>
      </header>

      {/* main contains */}
      <main className="app-content">
        {renderContent()}
      </main>

      {/* botton navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'Shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}>
          <span className="icon" name="Shop_icon"></span>
          <span className="label">Shop</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}>
          <span className="icon" name="search_icon"></span>
          <span className="label">search</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}>
          <span className="icon" name="profile_icon"></span>
          <span className="label">profile</span>
        </button>
      </nav>
    </div>
  );
}

export default App;