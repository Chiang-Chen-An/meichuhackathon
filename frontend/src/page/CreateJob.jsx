import React, { useState, useEffect } from "react";
import "./CreateJob.css";
import { createJob } from "../route/job";
import { Navigate, useNavigate } from "react-router-dom";

function CreateJobPageOne() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    job_name: "",
    job_type: "",
    payment_high: "",
    payment_low: "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("jobDataPage1");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setJobData(parsedData);
      } catch (error) {
        localStorage.removeItem("jobDataPage1");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobData.job_name || !jobData.job_type) {
      setError("Please fill in all required fields.");
      return;
    }

    localStorage.setItem("jobDataPage1", JSON.stringify(jobData));

    navigate("/createJob2");
  };

  const handleCancel = () => {
    setJobData({
      job_name: "",
      job_type: "",
      payment_low: "",
      payment_high: "",
    });
    localStorage.removeItem("jobDataPage1");
    localStorage.removeItem("jobDataPage2");
    navigate("/");
  };

  return (
    <div className="create-job-page">
      <h2 className="create-job-header">Provide Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="create-job-input-box first-child">
          <label htmlFor="job-name" className="create-job-label">
            Job name:
          </label>
          <input
            type="text"
            id="job-name"
            name="job_name"
            className="create-job-input"
            value={jobData.job_name}
            onChange={handleChange}
          />
        </div>

        <div className="create-job-input-box">
          <label htmlFor="job-type" className="create-job-label">
            Job type:
          </label>
          <input
            type="text"
            id="job-type"
            name="job_type"
            className="create-job-input"
            value={jobData.job_type}
            onChange={handleChange}
            defaultValue={jobData.job_type}
          />
        </div>

        <div className="create-job-input-box">
          <label htmlFor="payment" className="create-job-label">
            Payment:
          </label>
          <div className="create-job-input-range-box">
            <input
              type="number"
              id="payment-low"
              name="payment_low"
              className="create-job-input-range"
              value={jobData.payment_low}
              onChange={handleChange}
              defaultValue={jobData.payment_low}
            />
            ~
            <input
              type="number"
              id="payment-high"
              name="payment_high"
              className="create-job-input-range"
              value={jobData.payment_high}
              onChange={handleChange}
              defaultValue={jobData.payment_high}
            />
          </div>
        </div>

        <div className="action-button-box">
          <button
            type="button"
            className="action-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className="action-button">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJobPageOne;
