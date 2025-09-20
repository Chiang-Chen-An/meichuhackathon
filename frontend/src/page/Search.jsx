import React, { useState, useEffect } from "react";
import { get_jobs, get_jobs_by_keyword } from "../route/job";
import { batchCheckJobsSaved } from "../route/userJob";
import Navigation from "../components/navigation";
import { FaSearch } from "react-icons/fa";
import JobElement from "../components/job_element";
import "./Search.css";

function SearchPage() {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState();
  const [savedStatusMap, setSavedStatusMap] = useState({});

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await get_jobs();
      console.log("Searching successful:", response);
      setJobs(response);
      
      // 批量檢查收藏狀態
      if (response && response.length > 0) {
        await checkSavedStatusForJobs(response);
      }
    } catch (error) {
      console.error("Searching failed:", error);
    }
  };

  const checkSavedStatusForJobs = async (jobList) => {
    try {
      const jobIds = jobList.map(job => job.job_id).filter(id => id);
      if (jobIds.length > 0) {
        const statusResponse = await batchCheckJobsSaved(jobIds);
        setSavedStatusMap(statusResponse.saved_status);
      }
    } catch (error) {
      console.error("Check saved status failed:", error);
      // 如果檢查失敗（比如未登入），就保持空的狀態映射
    }
  };

  const handleJobSaved = (savedJob) => {
    console.log('Job saved:', savedJob);
    // 更新收藏狀態映射
    setSavedStatusMap(prev => ({
      ...prev,
      [savedJob.job_id]: true
    }));
  };

  const handleSearch = async () => {
    try {
      console.log(searchText);
      const response = await get_jobs_by_keyword({ 'name': searchText });
      console.log(response);
      setJobs(response.jobs || []);
      
      // 批量檢查新搜尋結果的收藏狀態
      if (response.jobs && response.jobs.length > 0) {
        await checkSavedStatusForJobs(response.jobs);
      }
    } catch (error) {
      console.error(error);
      alert("Searching failed");
      setJobs([]);
      setSavedStatusMap({});
    }
  };

  return (
    <>
      <div className="search-content-page">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs, location, company"
            className="search-input"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
        <div className="job-list">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div className="job-item" key={job.job_id || index}>
                <JobElement 
                  job={job} 
                  onSave={handleJobSaved}
                  initialSavedStatus={savedStatusMap[job.job_id] || false}
                />
              </div>
            ))
          ) : (
            <p className="no-result-text">No jobs found</p>
          )}
        </div>
        <Navigation />
      </div>
    </>
  );
}

export default SearchPage;
