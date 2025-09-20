import React from "react";

function JobElement({ job }) {
  return (
    <div className="job-element">
      <h5 className="job-name">{job.job_name}</h5>
      <p className="job-payment">{job.payment}</p>
      <p className="job-date">{job.date}</p>
      <p className="job-type">{job.type}</p>
      {/* <p className="job-description">{job.description}</p> */}
    </div>
  );
}

export default JobElement;
