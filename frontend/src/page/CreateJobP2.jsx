import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createJob } from "../route/job";

import "./CreateJobP2.css";

function CreateJobPageTwo() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [jobDataPage2, setJobDataPage2] = useState({
    date_start: "",
    date_end: "",
    video: null,
  });
  const [jobDataPage1, setJobDataPage1] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("jobDataPage1");
    if (!savedData) {
      navigate("/createjob1");
      return;
    }
    setJobDataPage1(JSON.parse(savedData));

    const savedDataPage2 = localStorage.getItem("jobDataPage2");
    if (savedDataPage2) {
      try {
        const parsedPage2Data = JSON.parse(savedDataPage2);
        setJobDataPage2((prev) => ({
          ...prev,
          date_start: parsedPage2Data.date_start || "",
          date_end: parsedPage2Data.date_end || "",
        }));
      } catch (error) {
        localStorage.removeItem("jobDataPage2");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDataPage2((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("please upload a valid video file");
        return;
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Video size exceeds 100MB limit");
        return;
      }

      setJobDataPage2((prev) => ({
        ...prev,
        video: file,
      }));

      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);

      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!jobDataPage2.date_start || !jobDataPage2.date_end) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    Object.keys(jobDataPage1).forEach((key) => {
      formData.append(key, jobDataPage1[key]);
    });

    formData.append("date_start", jobDataPage2.date_start);
    formData.append("date_end", jobDataPage2.date_end);

    if (jobDataPage2.video) {
      formData.append("video", jobDataPage2.video);
    }

    try {
      const res = await createJob(formData);
      console.log("Job created successfully:", res);

      alert("Job created successfully!");

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      localStorage.removeItem("jobDataPage1");
      localStorage.removeItem("jobDataPage2");
      navigate("/");
    } catch (err) {
      console.error("Error creating job:", err);
      setError(err.message || "Error creating job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const dataToSave = {
      date_start: jobDataPage2.date_start,
      date_end: jobDataPage2.date_end,
    };
    localStorage.setItem("jobDataPage2", JSON.stringify(dataToSave));
    navigate("/createjob1");
  };

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  return (
    <div className="create-job-page-2">
      <h2 className="create-job-header-2">Provide Job</h2>

      <form onSubmit={handleSubmit}>
        <div className="create-job-input-box-2 first-child">
          <label htmlFor="date-start" className="create-job-label-2">
            Date:
          </label>
          <div className="create-job-input-range-box-2">
            <input
              type="date"
              id="date-start"
              name="date_start"
              className="create-job-input-range-2"
              value={jobDataPage2.date_start}
              onChange={handleChange}
              required
            />
            ~
            <input
              type="date"
              id="date-end"
              name="date_end"
              className="create-job-input-range-2"
              value={jobDataPage2.date_end}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="create-job-input-box-2">
          <label htmlFor="video" className="create-job-label-2">
            Video:
          </label>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/mp4,video/avi,video/mov,video/*"
            onChange={handleFileChange}
            className="video-input-box"
          />
          {jobDataPage2.video && (
            <div style={{ marginTop: "10px", color: "#666" }}>
              choose file: {jobDataPage2.video.name}(
              {(jobDataPage2.video.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        <div className="action-button-box-2">
          <button
            type="button"
            className="action-button-2"
            onClick={handleBack}
          >
            Previous
          </button>
          <button type="submit" className="action-button-2" disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJobPageTwo;
