import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./navigation.css";

function Navigation() {
  const [focusedLinkIndex, setFocusedLinkIndex] = useState(-1);

  const navLinks = [
    { to: "/home", label: "Home", iconName: "Shop_icon" },
    { to: "/search", label: "Search", iconName: "search_icon" },
    { to: "/saved", label: "Saved", iconName: "saved_icon" },
    { to: "/profile", label: "Profile", iconName: "profile_icon" },
  ];

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
    <nav className="bottom-nav">
      {navLinks.map((link, index) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""} ${
              focusedLinkIndex === index ? "focused" : ""
            }`
          }
          ref={linkRefs.current[index]}
          tabIndex={0}
        >
          <span className="icon" name={link.iconName}></span>
          <span className="label">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;
