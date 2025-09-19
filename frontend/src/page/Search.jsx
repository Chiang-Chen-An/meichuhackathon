import React from 'react';
import './Search.css';

function SearchPage() {
  return (
    <div className="content-page">
      <h2 className="page-title">searching for goods</h2>
      <input type="text" placeholder="Enter keywords here to search..." className="search-input" />
      <button className="search-button">search</button>
      <p className="no-result-text">nothing be found</p>
    </div>
  );
}

export default SearchPage;