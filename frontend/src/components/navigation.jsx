import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaBookmark, FaUser } from 'react-icons/fa'
import "./navigation.css";

function Navigation() {
  const [focusedLinkIndex, setFocusedLinkIndex] = useState(-1);
  const isLoggedIn = false;//localStorage.getItem("isLoggedIn") === true;

  const iconMap = {
    home_icon: <FaHome size={24} />,
    search_icon: <FaSearch size={24} />,
    profile_icon: <FaUser size={24} />,
    saved_icon: <FaBookmark size={24} />,
  };

  const navLinks = [
    { to: "/home", iconName: "home_icon"},
    { to: "/search", iconName: "search_icon" },
    { to: "/saved", iconName: "saved_icon"},
    {
      to: isLoggedIn ? "/profile" : "/register", // Redirect to login if not logged in
      iconName: "profile_icon",
    //   label: isLoggedIn ? "Profile" : "Log In", // Change label based on login state
    },
  ];

  const handleNavClick = (e, link) => {
    if (link.to === "/profile" && !isLoggedIn) {
      e.preventDefault();
      alert("You must log in to access your profile.");
      navigate("/register");
    }
  };

  const linkRefs = useRef([]);
  linkRefs.current = navLinks.map(
    (_, i) => linkRefs.current[i] ?? React.createRef()
  );
      
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isNavFocused =
        document.activeElement &&
        linkRefs.current.some(
          (ref) => ref.current && ref.current.contains(document.activeElement)
        );

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setFocusedLinkIndex((prevIndex) => {
            if (prevIndex === -1) return 3;
            if (prevIndex === 0) return -1;
            return (prevIndex - 1 + navLinks.length) % navLinks.length;
          });
          break;
        case "ArrowRight":
          event.preventDefault();
          setFocusedLinkIndex((prevIndex) => {
            if (prevIndex === -1) return 0;
            if (prevIndex === 3) return -1;
            return (prevIndex + 1) % navLinks.length;
          });
          break;
        case "Enter":
          event.preventDefault();
          if (
            focusedLinkIndex !== -1 &&
            linkRefs.current[focusedLinkIndex].current
          ) {
            setFocusedLinkIndex(-1);
            linkRefs.current[focusedLinkIndex].current.click();
          }
          break;
        default:
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

  return (    
    <div className="fixed-bottom-bar">
      {navLinks.map((link) => (
        <div className="text-item" key={link.to}>
          <NavLink 
            to={link.to}
            onClick={(e) => handleNavClick(e, link)}
            className={({ isActive }) => isActive ? "active" : ""}
          >
            {/* Dynamically render icon */}
            {iconMap[link.iconName]}

            {/* Render the label if available */}
            {link.label && <span>{link.label}</span>}
          </NavLink>
        </div>
      ))}
    </div>
  );
}

export default Navigation;
