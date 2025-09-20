import React, { useState, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import "./Home.css";

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState("short");

  const videos = [
    {
      id: 1,
      name: "Video 1",
      data: "Banana is very yummy",
      videoUrl: "/video/test.mp4", // Local MP4
      type: "mp4",
    },
    {
      id: 2,
      name: "Video 2",
      data: "Cat looks sad",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // YouTube
      type: "iframe",
    },
    {
      id: 3,
      name: "Video 3",
      data: "Crying cat looks yummy",
      videoUrl: "https://www.youtube.com/embed/Kx2-7-cXpg8", // YouTube
      type: "iframe",
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMode = () => setMode(mode === "short" ? "list" : "short");

  return (
    <div className="home-content-page">
      <button className="mode-toggle-button" onClick={toggleMode}>
        <FaExchangeAlt size={20} />
      </button>

      <div className="video-screen">
        {mode === "short" ? (
          <div className="video-item">
            {videos[currentIndex].type === "mp4" ? (
              <video
                src={videos[currentIndex].videoUrl}
                autoPlay
                loop
                muted
                style={{ width: "100%", height: "100%" }}
                controls={false}
              />
            ) : (
              <iframe
                title={videos[currentIndex].name}
                src={`${videos[currentIndex].videoUrl}?autoplay=1&loop=1&controls=0&mute=1`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay"
                allowFullScreen={false}
              />
            )}
            <div className="data-wrap" name="short">
              <p className="video-name">{videos[currentIndex].name}</p>
              <p className="video-data">{videos[currentIndex].data}</p>
            </div>
          </div>
        ) : (
          <div className="video-list">
            {videos.map((video) => (
              <div key={video.id} className="video-item">
                {video.type === "mp4" ? (
                  <video
                    src={video.videoUrl}
                    autoPlay
                    loop
                    muted
                    style={{ width: "100%", height: "100%" }}
                    controls={false}
                  />
                ) : (
                  <iframe
                    title={video.name}
                    src={`${video.videoUrl}?autoplay=1&loop=1&controls=0&mute=1`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay"
                    allowFullScreen={false}
                  />
                )}
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
