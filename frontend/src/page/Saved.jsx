import React, { useState, useEffect } from "react";
import "./Saved.css";
import Navigation from "../components/navigation";
import JobElement from "../components/job_element";
import { getSavedJob } from "../route/userJob";

function SavedPage() {
  const [saved_jobs, set_saved_jobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleJobUnsaved = (unsavedJob) => {
    console.log('Job unsaved:', unsavedJob);
    // 從列表中移除已取消收藏的工作
    set_saved_jobs(prevJobs => 
      prevJobs.filter(savedJobData => 
        savedJobData.job?.job_id !== unsavedJob.job_id
      )
    );
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
      <h3>Saved Jobs</h3>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchSavedJobs} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <div className="saved-info">
        <div className="saved-list">
          {saved_jobs.length > 0 ? (
            saved_jobs.map((savedJobData, index) => (
              <div className="saved-item" key={savedJobData.job?.job_id || index}>
                <JobElement 
                  job={savedJobData.job} 
                  showSaveButton={false}  // 在收藏頁面不顯示收藏按鈕
                  showUnsaveButton={true}  // 顯示取消收藏按鈕
                  onUnsave={handleJobUnsaved}  // 取消收藏的回調
                />
                <div className="saved-date">
                  收藏時間: {savedJobData.saved_date ? new Date(savedJobData.saved_date).toLocaleDateString() : '未知'}
                </div>
              </div>
            ))
          ) : (
            <div className="no-result-container">
              <p className="no-result-text">Nothing Saved</p>
              <p className="no-result-subtitle">
                Start browsing jobs and save the ones you like!
              </p>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default SavedPage;
