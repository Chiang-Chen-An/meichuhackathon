import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import "./App.css"; // 你的主 App CSS 檔案

// 導入頁面組件
import HomePage from "./page/Home";
import SearchPage from "./page/Search";
import ProfilePage from "./page/Profile";
import RegisterPage from "./page/Register";
// import SavedPage from './page/Saved';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* logo or title */}
        <header className="app-header">
          <h3>KaziLink</h3>
        </header>

        {/* main contains */}
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />{" "}
            {/* 根路徑顯示 ShopPage */}
            <Route path="/home" element={<HomePage />} />
            {/* <Route path="/saved" element={<SavedPage />} /> */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
