import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaBookmark, FaUser } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import "./navigation.css";

function Navigation() {
  const [nav, setNavMode] = useState(0);
  const isLoggedIn = false; //localStorage.getItem("isLoggedIn") === true;
  const navigate = useNavigate();

  const iconMap = {
    home_icon: <FaHome />,
    search_icon: <FaSearch />,
    create_icon: <IoMdAdd />,
    saved_icon: <FaBookmark />,
    profile_icon: <FaUser />,
  };

  const navLinks = [
    { to: "/home", iconName: "home_icon" },
    { to: "/search", iconName: "search_icon" },
    { to: "/createJob", iconName: "create_icon" },
    { to: "/saved", iconName: "saved_icon" },
    {
      to: isLoggedIn ? "/profile" : "/register",
      iconName: "profile_icon",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isNumberKey =
        event.key >= "1" && event.key <= String(navLinks.length);

      switch (event.key) {
        case "LSK":
        case "Shift":
          if (nav === 0) setNavMode(1);
          else if (nav === 1) setNavMode(0);
          console.log(`nav: ${nav}`);
          event.preventDefault();
          break;

        default:
          if (nav === 1 && isNumberKey) {
            event.preventDefault();
            const index = parseInt(event.key, 10) - 1;
            if (navLinks[index]) {
              navigate(navLinks[index].to); // 🚀 直接跳轉
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nav, navLinks, navigate]);

  return (
    <div className="fixed-bottom-bar">
      {navLinks.map((link, i) => (
        <div className="text-item" key={link.to}>
          <NavLink
            to={link.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {/* Icon */}
            {iconMap[link.iconName]}
            {/* 顯示數字提示 */}
            <span className="nav-number">{i + 1}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
}

export default Navigation;
