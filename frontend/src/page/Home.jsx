import React, { useState, useEffect, useRef } from "react";
import Navigation from "../components/navigation";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./Home.css";
function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nav, setNavMode] = useState(0);
  const [mode, setMode] = useState("short");

  const navigate = useNavigate();

  const videos = [
    // TODO: 模擬影片用的靜態array，這邊要改成從資料庫抓影片
    {
      id: 1,
      name: "Video 1",
      data: "Bnana is very yummy",
      videoUrl: "/video/test.mp4",
    },
    {
      id: 2,
      name: "Video 2",
      data: "cat looks sad",
      videoUrl: "/video/test2.mp4",
    },
    {
      id: 3,
      name: "Video 3",
      data: "crying cat looks yummy",
      videoUrl: "/video/test.mp4",
    },
  ];

  const handleKeyDown = (event) => {
    if (nav === 0 && event.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    } else if (nav === 0 && event.key === "ArrowLeft") {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
      );
    } else if (nav === 0 && event.key === "enter") {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
      ); // 改成 把現在的短影音加入收藏
    } else if (event.key === "LSK") {
      if (nav === 0) setNavMode(1);
      else setNavMode(0);
      console.log(`nav: ${nav}`);
    }
    console.log("Current Image Path:", videos[currentIndex].image);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
            <video
              className="video"
              key={videos[currentIndex].videoUrl}
              autoPlay
              loop
              x-puffin-playsinline
              // playsInline
              // webkit-playsinline
              // disablePictureInPicture
              disablePictureInPicture
            >
              <source src={videos[currentIndex].videoUrl} type="video/mp4" />
            </video>
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
                    disablePictureInPicture
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
