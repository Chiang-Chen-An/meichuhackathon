import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaBookmark, FaUser } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { getCurrentUser } from "../route/user";
import "./navigation.css";

function Navigation() {
  const [nav, setNavMode] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusedLinkIndex, setFocusedLinkIndex] = useState(-1);
  const navigate = useNavigate();

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
    { to: "/home", iconName: "home_icon", label: "Home" },
    { to: "/search", iconName: "search_icon", label: "Search" },
    { to: "/createJob1", iconName: "create_icon", label: "Create" },
    { to: "/saved", iconName: "saved_icon", label: "Saved" },
    {
      to: isLoggedIn ? "/profile" : "/login",
      iconName: "profile_icon",
      label: isLoggedIn ? "Profile" : "Login",
    },
  ];

  const linkRefs = useRef([]);
  linkRefs.current = navLinks.map(
    (_, i) => linkRefs.current[i] ?? React.createRef()
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

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
              navigate(navLinks[index].to);
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nav, navigate, navLinks]);

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
          <NavLink
            to={link.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {iconMap[link.iconName]}
            {link.label}
          </NavLink>
        </div>
      ))}
    </div>
  );
}

export default Navigation;
