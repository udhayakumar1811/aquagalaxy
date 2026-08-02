import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-text">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="not-found-home-btn">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
