import React, { useState, useEffect } from "react";
import "./job_element.css";
import { savedJob, checkJobSaved, unsaveJob } from "../route/userJob";

function JobElement({
  job,
  showSaveButton = true,
  showUnsaveButton = false,
  onSave,
  onUnsave,
  initialSavedStatus = false,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSavedStatus);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    if (showSaveButton && job?.job_id && !initialSavedStatus) {
      checkSavedStatus();
    }
  }, [job?.job_id, showSaveButton, initialSavedStatus]);

  const checkSavedStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const response = await checkJobSaved(job.job_id);
      setIsSaved(response.is_saved);
    } catch (error) {
      console.error("Check saved status failed:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      setIsSaving(true);
      const response = await savedJob({ job_id: job.job_id });
      console.log("Save job successful:", response);
      setIsSaved(true);

      if (onSave) {
        onSave(job);
      }
    } catch (error) {
      console.error("Save job failed:", error);
      if (error.message === "Job already saved") {
        setIsSaved(true);
      } else {
        alert(error.message || "Failed to save job");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsaveJob = async () => {
    if (!window.confirm("確定要取消收藏這個工作嗎？")) {
      return;
    }

    try {
      setIsUnsaving(true);
      const response = await unsaveJob(job.job_id);
      console.log("Unsave job successful:", response);
      setIsSaved(false);

      if (onUnsave) {
        onUnsave(job);
      }
    } catch (error) {
      console.error("Unsave job failed:", error);
    } finally {
      setIsUnsaving(false);
    }
  };

  return (
    <div className="job-element">
      <div className="job-content">
        <h5 className="job-name">{job.job_name}</h5>
        <p className="job-payment">{job.payment}</p>
        <p className="job-date">{job.date}</p>
        <p className="job-type">{job.type}</p>
        <p className="job-phone">{job.phone}</p>
      </div>

      {(showSaveButton || showUnsaveButton) && (
        <div className="job-actions">
          {showSaveButton && (
            <button
              className={`save-button ${isSaved ? "saved" : ""}`}
              onClick={handleSaveJob}
              disabled={isSaving || isSaved || isCheckingStatus}
            >
              {isCheckingStatus
                ? "Checking..."
                : isSaving
                ? "Saving..."
                : isSaved
                ? "Saved"
                : "Save"}
            </button>
          )}

          {showUnsaveButton && (
            <button
              className="unsave-button"
              onClick={handleUnsaveJob}
              disabled={isUnsaving}
            >
              {isUnsaving ? "Removing..." : "Remove from Saved"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default JobElement;
