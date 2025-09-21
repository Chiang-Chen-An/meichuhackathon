import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Saved.css";
import Navigation from "../components/navigation";
import { getSavedJob } from "../route/userJob";
import { FaSave, FaMoneyBillWave } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

function SavedPage() {
  const [saved_jobs, set_saved_jobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getSavedJob();
      console.log("Get saved jobs successful:", response);
      set_saved_jobs(response.jobs || []);
    } catch (error) {
      console.error("Get saved jobs failed:", error);
      setError(error.message || "Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="saved-content-page">
        <h3>Saved Jobs</h3>
        <div className="loading-message">Loading your saved jobs...</div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="saved-content-page">
      {!error && <h3>Saved Jobs</h3>}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={handleLoginRedirect} className="login-button">
            Login
          </button>
        </div>
      )}

      <div className="saved-info">
        <div className="saved-list">
          {!error && saved_jobs.length > 0 ? (
            saved_jobs.map((savedJobData, index) => (
              <button
                className="job-button"
                key={savedJobData.job?.job_id || index}
                onClick={() =>
                  navigate(`/job_detail/${savedJobData.job?.job_id}`)
                }
              >
                <div className="job-text">
                  {savedJobData.job?.job_name || "Job Name Not Available"}
                </div>
                <div className="job-tag">
                  {savedJobData.job?.type || "Type Not Specified"}
                </div>
                <div className="job-text">
                  <FaMoneyBillWave />{" "}
                  {savedJobData.job?.payment || "Salary Not Listed"}
                </div>
                <div className="job-text">
                  <MdDateRange />{" "}
                  {savedJobData.job?.date || "Date Not Available"}
                </div>
                <div className="job-text">
                  <FaSave />{" "}
                  {savedJobData.saved_date
                    ? new Date(savedJobData.saved_date).toLocaleDateString()
                    : "Unknown"}
                </div>
              </button>
            ))
          ) : !error ? (
            <div className="no-result-container">
              <p className="no-result-text">Nothing Saved</p>
              <p className="no-result-subtitle">
                Start browsing jobs and save the ones you like!
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <Navigation />
    </div>
  );
}

export default SavedPage;
