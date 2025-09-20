import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaBookmark, FaUser } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { getCurrentUser } from '../route/user';
import "./navigation.css";

function Navigation() {
  const [nav, setNavMode] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 檢查登入狀態
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const iconMap = {
    home_icon: <FaHome />,
    search_icon: <FaSearch />,
    create_icon: <IoMdAdd />,
    saved_icon: <FaBookmark />,
    profile_icon: <FaUser />,
  };

  const navLinks = [
    { to: "/home", iconName: "home_icon", label: "Home"},
    { to: "/search", iconName: "search_icon", label: "Search" },
    { to: "/createJob", iconName: "create_icon", label: "Create"},
    { to: "/saved", iconName: "saved_icon", label: "Saved"},
    {
      to: "#", // 使用 # 作為佔位符，實際導航由 handleNavClick 處理
      iconName: "profile_icon",
      label: isLoggedIn ? "Profile" : "Login"
    },
  ];

  const handleNavClick = (e, link) => {
    if (link.iconName === "profile_icon") {
      e.preventDefault();
      if (isLoggedIn) {
        navigate("/profile");
      } else {
        navigate("/login");  // 改為跳轉到登入頁面
      }
    }
  };

  const linkRefs = useRef([]);
  linkRefs.current = navLinks.map(
    (_, i) => linkRefs.current[i] ?? React.createRef()
  );
      
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
  }, [navLinks.length, focusedLinkIndex]);

  useEffect(() => {
    if (
      focusedLinkIndex !== -1 &&
      linkRefs.current[focusedLinkIndex] &&
      linkRefs.current[focusedLinkIndex].current
    ) {
      linkRefs.current[focusedLinkIndex].current.focus();
    } else if (focusedLinkIndex === -1) {
      if (
        document.activeElement &&
        linkRefs.current.some(
          (ref) => ref.current && ref.current.contains(document.activeElement)
        )
      ) {
        document.activeElement.blur();
      }
    }
  }, [focusedLinkIndex]);

  // 等待登入狀態檢查完成
  if (loading) {
    return (
      <div className="fixed-bottom-bar">
        <div className="text-item">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed-bottom-bar">
      {navLinks.map((link, index) => (
        <div className="text-item" key={link.iconName}>
          {link.iconName === "profile_icon" ? (
            <button 
              onClick={(e) => handleNavClick(e, link)}
              className={"nav-button"}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px',
                fontSize: 'inherit'
              }}
            >
              {iconMap[link.iconName]}
              {link.label && <span style={{ fontSize: '10px', marginTop: '2px' }}>{link.label}</span>}
            </button>
          ) : (
            <NavLink 
              to={link.to}
              className={({ isActive }) => isActive ? "active" : ""}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              {iconMap[link.iconName]}
              {link.label && <span style={{ fontSize: '10px', marginTop: '2px' }}>{link.label}</span>}
            </NavLink>
          )}
        </div>
      ))}
    </div>
  );
}

export default Navigation;
