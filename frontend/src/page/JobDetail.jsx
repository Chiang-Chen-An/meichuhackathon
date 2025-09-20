import { get_job_by_job_id } from "../route/job";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log(`Fetching data for job ID: ${jobId}`);
        const jobData = await get_job_by_job_id(jobId);

        if (jobData) {
          setJob(jobData);
        } else {
          setError("Job not found.");
        }
      } catch (err) {
        console.error("Error fetching job data:", err);
        setError("Failed to load job data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (isLoading) {
    return <div className="job-detail-page">Loading...</div>;
  }

  if (error) {
    return <div className="job-detail-page">Error: {error}</div>;
  }

  if (!job) {
    return <div className="job-detail-page">Job not found.</div>;
  }

  return (
    <div className="job-detail-page">
      <p className="job-name">{job.job_name}</p>
      <p className="job-payment">{job.payment}</p>
      <p className="job-date">{job.date}</p>
      <p className="job-type">{job.type}</p>
      {/* <video
        className="video"
        key={job.videoUrl}
        autoPlay
        loop
        muted
        x-puffin-playsinline=""
      >
        <source src={job.videoUrl} type="video/mp4" />
      </video> */}
    </div>
  );
}

export default JobDetailPage;
