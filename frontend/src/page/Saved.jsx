import React, { useState, useEffect, useRef } from "react";
import "./Saved.css";
import Navigation from "../components/navigation";

function SavedPage() {
  const [saved_jobs, set_saved_jobs] = useState([]);

  // useEffect(() => {
  //   get_saved_jobs()
  //     .then((response) => {
  //       console.log("Get saved jobs successful:", response);
  //       setJobs(response);
  //     })
  //     .catch((error) => {
  //       console.error("Get saved jobs failed:", error);
  //     });
  // }, []);

  return (
    <div className="saved-content-page">
      <h3>Saved works</h3>
      <div className="saved-info">
        <div className="saved-list">
          {saved_jobs.length > 0 ? (
            saved_jobs.map((job, index) => (
              <div className="saved-item" key={index}>
                <JobElement job={job} />
              </div>
            ))
          ) : (
            <p className="no-result-text">Nothing Saved</p>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default SavedPage;
