import React, { useState, useEffect } from "react";
import { get_jobs, get_jobs_by_keyword } from "../route/job";
import Navigation from "../components/navigation";
import { FaSearch } from "react-icons/fa";
import JobElement from "../components/job_element";
import "./Search.css";

function SearchPage() {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState();

  useEffect(() => {
    get_jobs()
      .then((response) => {
        console.log("Searching successful:", response);
        setJobs(response);
      })
      .catch((error) => {
        console.error("Searching failed:", error);
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
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="search-button" onClick={() => {
            console.log(searchText);
            get_jobs_by_keyword({ 'name': searchText })
              .then((msg) => {
                console.log(msg);
                // alert(msg.message);
                setJobs(msg.jobs);
              })
              .catch((err) => {
                console.error(err);
                alert("Searching failed");
                setJobs([]);
              });
          }}>
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
        <Navigation />
      </div>
    </>
  );
}

export default SearchPage;
