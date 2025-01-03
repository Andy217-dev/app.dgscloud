import React from "react";
import "./Loading.css";
import Lottie from "react-lottie";
import Data from "./loading.json";

function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Data,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="loader">
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
}

export default Loading;
