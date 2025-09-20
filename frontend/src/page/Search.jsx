import React, { useState, useEffect } from "react";
import { get_jobs, get_jobs_by_keyword } from "../route/job";
import Navigation from "../components/navigation";
import { FaSearch } from "react-icons/fa";
import "./Search.css";

function SearchPage() {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState();

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
            placeholder="Search for jobs, location, company"
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
              <div className="job-item" key={job.job_id || index}>
                <div className="job-card">
                  <div className="job-header">
                    <h3 className="job-name">
                      {job.job_name || "Job Name Not Available"}
                    </h3>
                    <span className="job-type">
                      {job.type || "Type Not Specified"}
                    </span>
                  </div>
                  <div className="job-details">
                    <div className="job-info">
                      <span className="job-salary">
                        💰 {job.payment || "Salary Not Listed"}
                      </span>
                      <span className="job-date">
                        📅 {job.date || "Date Not Available"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
