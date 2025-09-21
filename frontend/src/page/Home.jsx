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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await get_jobs();
        console.log("Searching successful:", response);
        setJobs(response);
      } catch (error) {
        console.error("Searching failed:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleKeyDown = (event) => {
    console.log(jobs);
    if (jobs.length === 0) return;
    if (nav === 0 && event.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % jobs.length);
    } else if (nav === 0 && event.key === "ArrowLeft") {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + jobs.length) % jobs.length
      );
    } else if (nav === 0 && event.key === "enter") {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + jobs.length) % jobs.length
      );
    } else if (event.key === "LSK") {
      if (nav === 0) setNavMode(1);
      else setNavMode(0);
      console.log(`nav: ${nav}`);
    }
    // console.log("Current Image Path:", jobs[currentIndex].image);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [jobs, currentIndex, nav]);

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
          jobs.length > 0 && jobs[currentIndex] ? (
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
          <div className="loading">Loading jobs...</div>
        )
        ) : (
          <div className="video-list">
            {jobs.map((job) => (
              <button
                key={job.job_id}
                className="video-item"
                onClick={() => navigate(`/job_detail/${job.job_id}`)}
              >
                <div name="list" className="video-container">
                  <video
                    className="video"
                    key={job.job_id} // force reload if video changes
                    autoPlay
                    loop
                    muted
                    x-puffin-playsinline=""
                  >
                    <source src={`${API_BASE_URL}/job/${job.job_id}/video`} type="video/mp4" />
                  </video>
                </div>
                <div className="data-wrap" id="list">
                  <p className="video-name">{job.job_name}</p>
                  <p className="video-data">{job.type}</p>
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
