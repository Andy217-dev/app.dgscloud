import React from "react";
import CloudIcon from "../../../assets/image/cloudstorage-icon.svg";

export default function BlockStorage() {
  return (
    <section className="flex flex-col items-center justify-center relative bg-[#162C45] h-[80vh] m-4">
      <div className="bg-[#223d5bc7] w-[80%] p-6 sm:p-20 flex flex-col items-center justify-center relative z-20">
        <h2 className="text-3xl text-[#17FFD5] text-center">Coming Soon!</h2>
        <p className="text-center">
          Experience the future of{" "}
          <span className="text-[#17FFD5]">Block Storage</span>
        </p>
      </div>
      <img
        src={CloudIcon}
        alt="Lubernetes"
        className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[200px] z-10"
      />
    </section>
  );
}
