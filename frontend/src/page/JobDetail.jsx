import { get_job_by_job_id } from "../route/job";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navigation from "../components/navigation";
import { ImProfile } from "react-icons/im";
import { FaMoneyBillWave, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { savedJob, unsaveJob, checkJobSaved } from "../route/userJob";
import "./JobDetail.css";
import { API_BASE_URL } from "../config";

function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await checkJobSaved(jobId);
        setIsSaved(data.is_saved);
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

  const save = async () => {
    const data = await checkJobSaved(jobId);
    console.log(data);
    try {
      if (data["is_saved"]) {
        await unsaveJob(jobId);
        setIsSaved(false);
      } else {
        console.log("123");
        await savedJob({ job_id: jobId });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error in checkJobSaved:", error);
      throw error;
    }
  };

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <button className="save-job-button" onClick={save}>
          {saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
        <p className="job-detail-text">
          <ImProfile /> {job.job_name}
        </p>
        <p className="job-detail-text">
          <FaMoneyBillWave /> {job.payment}
        </p>
        <p className="job-detail-text">
          <MdDateRange /> {job.date}
        </p>
        <p className="job-detail-text">
          <BiCategory /> {job.type}
        </p>
        <video
          className="video"
          key={job.videoUrl}
          autoPlay
          loop
          muted
          x-puffin-playsinline=""
        >
          <source src={`${API_BASE_URL}/job/${jobId}/video`} type="video/mp4" />
        </video>
      </div>
      <Navigation />
    </div>
  );
}

export default JobDetailPage;
