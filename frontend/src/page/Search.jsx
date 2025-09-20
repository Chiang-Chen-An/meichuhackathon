import React from "react";
import Navigation from "../components/navigation";
import "./Search.css";

function SearchPage() {
  return (
    <>
      <div className="content-page">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs, location, company"
            className="search-input"
          />
          <button className="search-button">search</button>
        </div>
        <p className="no-result-text">nothing be found</p>
      </div>
      <Navigation />
    </>
  );
}

export default SearchPage;
