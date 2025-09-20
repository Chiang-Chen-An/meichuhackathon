import React, { useState, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Navigation from "../components/navigation";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nav, setNavMode] = useState(0);
  const [mode, setMode] = useState("short");

  const videos = [
    {
      id: 1,
      name: "Video 1",
      data: "Banana is very yummy",
      videoUrl: "/video/test.mp4", // Example YouTube video
    },
    {
      id: 2,
      name: "Video 2",
      data: "Cat looks sad",
      videoUrl: "/video/test2.mp4", // Another YouTube video
    },
    {
      id: 3,
      name: "Video 3",
      data: "Crying cat looks yummy",
      videoUrl: "/video/test.mp4", // Another YouTube video
    },
  ];

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    } else if (event.key === "ArrowLeft") {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
      );
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, nav]);

  const toggleMode = () => {
    setMode(mode === "short" ? "list" : "short");
  };

  return (
    <div className="home-content-page">
      <button className="mode-toggle-button" onClick={toggleMode}>
        <FaExchangeAlt size={20} />
      </button>

      <div className="video-screen">
        {mode === "short" ? (
          <div className="video-item">
            <iframe
              title={videos[currentIndex].name}
              src={`${videos[currentIndex].videoUrl}?autoplay=1&loop=1&controls=0&mute=1`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen={false} // Prevent fullscreen
            />
            <div className="data-wrap" name="short">
              <p className="video-name">{videos[currentIndex].name}</p>
              <p className="video-data">{videos[currentIndex].data}</p>
            </div>
          </div>
        ) : (
          <div className="video-list">
            {videos.map((video) => (
              <div key={video.id} className="video-item">
                <div name="list" className="video-container">
                  <iframe
                    title={video.name}
                    src={`${video.videoUrl}?autoplay=1&loop=1&controls=0&mute=1`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen={false} // Prevent fullscreen
                  />
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

      {mode === "short" && (
        <div className="navigation-arrows">
          <IoIosArrowBack size={35} className="arrow-left" />
          <IoIosArrowForward size={35} className="arrow-right" />
        </div>
      )}

      <Navigation />
    </div>
  );
}

export default HomePage;
