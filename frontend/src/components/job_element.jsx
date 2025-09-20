import React from "react";

function JobElement({ job }) {
  return (
    <div className="job-element">
      <h5 className="job-title">{job.title}</h5>
      <p className="job-company">{job.company}</p>
      <p className="job-location">{job.location}</p>
      <p className="job-type">{job.type}</p>
      <p className="job-description">{job.description}</p>
    </div>
  );
}

export default JobElement;
