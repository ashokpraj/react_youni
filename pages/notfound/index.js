import Router from "next/router";
import React from "react";
import Conditionalheader from "../../components/layout/Conditionalheader";

function index() {
  const homeClick = () => {
    Router.push(`/dashboard`);
  };

  return (
    <>
      <Conditionalheader />
      <div className="main-page-content inner-page-main-content page-not-found">
        <section className="page-not-found-wrapper">
          <div className="not-found">
            <div className="notfound-404">
              <h1 className="page-not-found-title">404</h1>
              <h5 className="not-found-subtitle">Page not found</h5>
              <p>
                The page you are looking for might have been removed had its
                name changed or is temporarily unavailable.
              </p>
            </div>
            <button className="redirect-btn" onClick={homeClick}>
              Go to Homepage
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default index;
