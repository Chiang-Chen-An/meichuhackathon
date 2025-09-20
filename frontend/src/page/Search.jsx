import React from "react";
import Navigation from "../components/navigation";
import "./Search.css";

function SearchPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <div className="content-page">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs, location, company"
            className="search-input"
          />
          <button className="search-button">
            <i class="fa fa-search"></i>
          </button>
        </div>
        <p className="no-result-text">nothing be found</p>
      </div>
      <Navigation />
    </>
  );
}

export default SearchPage;
