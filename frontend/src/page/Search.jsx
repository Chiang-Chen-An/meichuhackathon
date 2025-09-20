import React, { useState, useEffect } from "react";
import { get_jobs } from "../route/job";
import Navigation from "../components/navigation";
import { FaSearch } from "react-icons/fa";
import JobElement from "../components/job_element";
import "./Search.css";

function SearchPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    get_jobs()
      .then((response) => {
        console.log("Registration successful:", response);
        setJobs(response);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  }, []);

  return (
    <>
      <div className="search-content-page">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs, location, company"
            className="search-input"
          />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>
        <div className="job-list">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div className="job-item" key={index}>
                <JobElement job={job} />
              </div>
            ))
          ) : (
            <p className="no-result-text">No jobs found</p>
          )}
        </div>
        <p className="no-result-text">nothing be found</p>
        <Navigation />
      </div>
    </>
  );
}

export default SearchPage;
