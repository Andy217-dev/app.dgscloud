import React from "react";
import SupportIcon from "../../assets/image/Support.svg";
import XIcon from "@mui/icons-material/X";
import TelegramIcon from "@mui/icons-material/Telegram";

export default function Support() {
  return (
    <section className="flex flex-col items-center justify-center relative rounded-lg h-[80vh] m-4">
      <div className=" w-[80%] rounded-lg p-6 sm:p-20 relative h-[300px] flex flex-col items-center justify-center z-20">
        <h2 className="text-3xl text-[#17FFD5] text-center">Coming Soon!</h2>
        <p className="text-center">
          Experience the future of{" "}
          <span className="text-[#17FFD5]">Support</span>
        </p>
        <p className="text-center mt-3 text-2xl text-[#17FFD5]">Contact Us</p>
        <div className="flex items-center gap-3 ">
          <a
            target="blank"
            className="w-fit hover:bg-white hover:text-black rounded-full p-1 duration-150"
            href="https://x.com"
          >
            <XIcon />
          </a>
          <a
            target="blank"
            className="w-fit hover:bg-white hover:text-black rounded-full p-1 duration-150"
            href="https://t.me"
          >
            <TelegramIcon style={{ width: 30, height: 30 }} />
          </a>
        </div>
        <img
          src={SupportIcon}
          alt="Lubernetes"
          className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] h-[80%] z-[-999] opacity-25"
        />
      </div>
    </section>
  );
}
