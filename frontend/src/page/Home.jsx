import React from 'react';
import './Home.css';
function HomePage() {
  return (
    <div className="content-page">
      <h2 className="page-title">searching for works</h2>
      <div className="product-grid">
        <div className="product-card">
          <div className="product-image"></div>
          <p className="product-name">none</p>
          <p className="product-price">$0</p>
        </div>
        <div className="product-card">
          <div className="product-image"></div>
          <p className="product-name">none</p>
          <p className="product-price">$0</p>
        </div>
        <div className="product-card">
          <div className="product-image"></div>
          <p className="product-name">none</p>
          <p className="product-price">$0</p>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;