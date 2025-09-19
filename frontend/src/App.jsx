import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
// import './App.css'; // 你的主 App CSS 檔案

// 導入頁面組件
import HomePage from './page/Home';
import SearchPage from './page/Search';
import ProfilePage from './page/Profile';
// import SavedPage from './page/Saved';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* logo or title */}
        <header className="app-header">
          <h1>KaziLink</h1>
        </header>

        {/* main contains */}
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* 根路徑顯示 ShopPage */}
            <Route path="/home" element={<HomePage />} />
            {/* <Route path="/saved" element={<SavedPage />} /> */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;