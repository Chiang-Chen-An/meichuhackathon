import React, { useState, useEffect } from "react";
import { getjobs } from "../user";
import Navigation from "../components/navigation";
import JobElement from "../components/job_element";
import "./Search.css";

function SearchPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getjobs()
      .then((response) => {
        console.log("Registration successful:", response);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="content-page">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs, location, company"
            className="search-input"
          />
          <button className="search-button">
            <i class="fa fa-search"></i>
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
        {/* <p className="no-result-text">nothing be found</p> */}
        <Navigation />
      </div>
    </>
  );
}

export default SearchPage;
