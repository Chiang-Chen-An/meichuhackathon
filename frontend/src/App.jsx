import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css'; // 你的主 App CSS 檔案

// 導入頁面組件
import HomePage from './Home';
import SearchPage from './Search';
import ProfilePage from './Profile';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* logo or title */}
        <header className="app-header">
          <h1>fake104</h1>
        </header>

        {/* main contains */}
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* 根路徑顯示 ShopPage */}
            <Route path="/home" element={<ShopPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        {/* botton navigation */}
        <nav className="bottom-nav">
          <NavLink
            to="/home"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon" name="Shop_icon"></span>
            <span className="label">Shop</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon" name="search_icon"></span>
            <span className="label">search</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon" name="profile_icon"></span>
            <span className="label">profile</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  );
}

export default App;