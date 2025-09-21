import React, { useState, useEffect } from "react";
import { get_jobs, get_jobs_by_keyword } from "../route/job";
import Navigation from "../components/navigation";
import { FaSearch, FaMoneyBillWave } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function SearchPage() {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await get_jobs();
      console.log("Searching successful:", response);
      setJobs(response);
    } catch (error) {
      console.error("Searching failed:", error);
    }
  };

  const handleSearch = async () => {
    try {
      console.log(searchText);
      const response = await get_jobs_by_keyword({ name: searchText });
      console.log(response);
      setJobs(response.jobs || []);
    } catch (error) {
      console.error(error);
      alert("Searching failed");
      setJobs([]);
    }
  };

  return (
    <>
      <div className="search-content-page">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
        <div className="job-list">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <button
                className="saved-item"
                key={job.job_id || index}
                onClick={() => navigate(`/job_detail/${job.job_id}`)}
              >
                <div className="job-text">
                  {job.job_name || "Job Name Not Available"}
                </div>
                <div className="job-tag">
                  {job.type || "Type Not Specified"}
                </div>
                <div className="job-text">
                  <FaMoneyBillWave /> {job.payment || "Salary Not Listed"}
                </div>
                <div className="job-text">
                  <MdDateRange /> {job.date || "Date Not Available"}
                </div>
              </button>
            ))
          ) : (
            <div className="no-result-container">
              <p className="no-result-text">No jobs found</p>
              <p className="no-result-subtitle">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
        <Navigation />
      </div>
    </>
  );
}

export default SearchPage;
