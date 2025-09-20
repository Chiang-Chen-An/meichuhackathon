import React, { useState, useEffect, useRef } from "react";
import Navigation from '../components/navigation';
import { FaExchangeAlt } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import './Home.css';
function HomePage() {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('short');
  
  const videos = [ // TODO: 模擬影片用的靜態array，這邊要改成從資料庫抓影片
    { id: 1, name: "Video 1", data: "Bnana is very yummy", image: "../assets/test.jpg" },
    { id: 2, name: "Video 2", data: "cat looks sad", image: "../assets/test.jpg" },
    { id: 3, name: "Video 3", data: "crying cat looks yummy", image: "../assets/test.jpg" }
  ];

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    } else if (event.key === "ArrowUp") {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    }else if (event.key === "enter") {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length); // 改成 把現在的短影音加入收藏
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
    setMode(mode === 'short' ? 'list' : 'short');
  };

  return (
    <div className="home-content-page">
      <button className="mode-toggle-button" onClick={toggleMode}>
        <FaExchangeAlt size={20} />
      </button>

      <div className="video-screen">
        {mode === 'short' ? (
          <div className="video-item">
            <div className="video-image" 
                  name ="short"
                  style={{ backgroundImage: `url(${videos[currentIndex].image})` }}></div>
            <div className="data-wrap" name="short">
              <p className="video-name">{videos[currentIndex].name}</p>
              <p className="video-data">{videos[currentIndex].data}</p>
            </div>
          </div>
        ) : (
          <div className="video-list">
            {videos.map((video) => (
              <div key={video.id} className="video-item">
                <div
                  className="video-image"
                  name ="list"
                  style={{ backgroundImage: `url(${video.image})` }}
                ></div>
                <div className="data-wrap" id ="list">
                  <p className="video-name">{video.name}</p>
                  <p className="video-data">{video.data}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navigation-arrows">
        <IoIosArrowBack size={35} className="arrow-left" />
        <IoIosArrowForward size={35} className="arrow-right" />
      </div>

      <Navigation />

    </div>
  );
}

export default HomePage;