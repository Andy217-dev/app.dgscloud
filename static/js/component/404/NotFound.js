import React from "react";
import "./404.css";

function NotFound() {
  return (
    <div id="notfound">
      <div className="notfound flex flex-col items-center">
        <div className="notfound-404">
          <h3 className="!text-white">Oops! Page not found</h3>
          <h1>
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </h1>
        </div>
        <h2 className="!text-white">
          we are sorry, but the page you requested was not found
        </h2>
      </div>
    </div>
  );
}

export default NotFound;
