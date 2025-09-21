import React, { useState, useEffect, useRef } from "react";
import Navigation from "../components/navigation";
import { get_jobs } from "../route/job";
import { FaExchangeAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { API_BASE_URL } from "../config/config";
function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nav, setNavMode] = useState(0);
  const [mode, setMode] = useState("short");

  const navigate = useNavigate();

  const videos = [
    {
      id: j,
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
  useEffect(async () => {
    try {
      const response = await get_jobs();
      console.log("Searching successful:", response);
      setJobs(response);
    } catch (error) {
      console.error("Searching failed:", error);
    }
  });

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
      );
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
          <button
            className="video-item"
            onClick={() => navigate(`/job_detail/${jobs[currentIndex].job_id}`)}
          >
            <video
              className="video"
              key={currentIndex}
              autoPlay
              loop
              muted
              x-puffin-playsinline=""
            >
              <source
                src={`${API_BASE_URL}/job/${jobs[currentIndex].job_id}/video`}
                type="video/mp4"
              />
            </video>
            <div className="data-wrap" name="short">
              <p className="video-name">{jobs[currentIndex].job_name}</p>
              <p className="video-data">{jobs[currentIndex].type}</p>
            </div>
          </button>
        ) : (
          <div className="video-list">
            {videos.map((video) => (
              <button
                key={video.id}
                className="video-item"
                onClick={() => navigate(`/job_detail/${video.id}`)}
              >
                <div name="list" className="video-container">
                  <video
                    className="video"
                    key={video.videoUrl} // force reload if video changes
                    autoPlay
                    loop
                    muted
                    x-puffin-playsinline=""
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                </div>
                <div className="data-wrap" id="list">
                  <p className="video-name">{video.name}</p>
                  <p className="video-data">{video.data}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {mode === "short" ? (
        <div className="navigation-arrows">
          <IoIosArrowBack size={35} className="arrow-left" tabIndex={-1} />
          <IoIosArrowForward size={35} className="arrow-right" tabIndex={-1} />
        </div>
      ) : (
        <></>
      )}

      <Navigation />
    </div>
  );
}

export default HomePage;
