import React from "react";
import NetworkingIcon from "../../assets/image/networking-icon.svg";

export default function Networking() {
  return (
    <section className="flex flex-col items-center justify-center relative  h-[80vh] m-4">
      <div className=" w-[80%] p-6 sm:p-20 flex flex-col items-center justify-center relative z-20">
        <h2 className="text-3xl text-[#17FFD5] text-center">Coming Soon!</h2>
        <p className="text-center">
          Experience the future of <span className="text-[#17FFD5]">Proxy</span>
        </p>
      </div>
      <img
        src={NetworkingIcon}
        alt="Lubernetes"
        className="opacity-25 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[200px] z-10"
      />
    </section>
  );
}
