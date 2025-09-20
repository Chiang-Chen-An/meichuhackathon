import React, { useState, useEffect, useRef } from "react";
const navLinks = [
    { to: "/nav" },
  ];

const linkRefs = useRef([]);
  linkRefs.current = navLinks.map(
    (_, i) => linkRefs.current[i] ?? React.createRef()
);

useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "LSK":
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