import React, { useState, useEffect, useRef } from "react";
import Navigation from "../components/navigation";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState("short");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRefs = useRef([]);

  const videos = [
    {
      id: 1,
      name: "Video 1",
      data: "Banana is very yummy",
      image: "../assets/test.jpg",
    },
    {
      id: 2,
      name: "Video 2",
      data: "Cat looks sad",
      image: "../assets/test.jpg",
    },
    {
      id: 3,
      name: "Video 3",
      data: "Crying cat looks yummy",
      image: "../assets/test.jpg",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        setFocusedIndex((prev) =>
          Math.min(prev + 1, buttonRefs.current.length - 1)
        );
      } else if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
        );
      } else if (e.key === "Enter") {
        if (focusedIndex > -1 && buttonRefs.current[focusedIndex]) {
          buttonRefs.current[focusedIndex].click();
          setFocusedIndex(-1);
        }
      } else if (e.key === "Shift" || e.key === "LSK") {
        setFocusedIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleMode = () => {
    setMode(mode === "short" ? "list" : "short");
  };

  const setRef = (index, element) => {
    buttonRefs.current[index] = element;
  };

  return (
    <div className="home-content-page">
      <button
        ref={(el) => setRef(0, el)}
        className={`mode-toggle-button ${focusedIndex === 0 ? "focused" : ""}`}
        onClick={toggleMode}
      >
        <FaExchangeAlt size={20} />
      </button>

      <div className="video-screen">
        {mode === "short" ? (
          <div className="video-item">
            <video
              className="video"
              key={videos[currentIndex].videoUrl} // force reload if video changes
              autoPlay
              loop
              muted
              // playsInline
              // webkit-playsinline
              x-puffin-playsinline
              // disablePictureInPicture
            >
              <source src={videos[currentIndex].videoUrl} type="video/mp4" />
            </video>
            <div className="data-wrap">
              <p className="video-name">{videos[currentIndex].name}</p>
              <p className="video-data">{videos[currentIndex].data}</p>
            </div>
          </div>
        ) : (
          <div className="video-list">
            {videos.map((video) => (
              <div key={video.id} className="video-item">
                <div name="list" className="video-container">
                  <video
                    className="video"
                    key={video.videoUrl} // force reload if video changes
                    autoPlay
                    loop
                    muted
                    // playsInline
                    // webkit-playsinline
                    // disablePictureInPicture
                    x-puffin-playsinline
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                </div>
                <div className="data-wrap" id="list">
                  <p className="video-name">{video.name}</p>
                  <p className="video-data">{video.data}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mode === "short" ? (
        <div className="navigation-arrows">
          <IoIosArrowBack size={35} className="arrow-left" />
          <IoIosArrowForward size={35} className="arrow-right" />
        </div>
      ) : (
        <></>
      )}

      <Navigation />
    </div>
  );
}

export default HomePage;
