import React, { useState, useEffect } from "react";
import "../../styles/Dapp.css";
import { useSelector } from "react-redux";
import { Button, Skeleton } from "@mui/material";
import Running from "../../assets/image/Running.svg";
import Stop from "../../assets/image/stop.svg";
import { Link, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import WithDraw from "./Withdraw";
import { IoSettingsOutline } from "react-icons/io5";

function DApp() {
  const [showWithDraw, setShowWithDraw] = useState(false);
  const navigate = useNavigate();
  const { data: isValidData, isLoading: isValidLoading } = useSelector(
    (state) => state?.Dcloud?.isValid
  );
  const { data: dashboardData, isLoading: dashboardLoading } = useSelector(
    (state) => state?.Dcloud?.dashboard
  );
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setBalance(isValidData?.data?.balance);
  }, [isValidData]);

  const generateSpec = (item) => {
    let prosessor = "";

    if (item?.plan?.includes("amd")) {
      prosessor = "AMD";
    } else if (item?.plan?.includes("intel")) {
      prosessor = "INTEL";
    } else if (item?.plan?.includes("nvidia")) {
      prosessor = "NVIDIA";
    }

    return `${prosessor} - ${item?.vcpu_count} vCPU ${item?.ram / 1024}GB RAM ${
      item?.disk
    } GB`;
  };

  const goToDetail = (url) => {
    navigate(url);
  };

  return (
    <>
      {showWithDraw && <WithDraw onClose={setShowWithDraw}></WithDraw>}
      <section className="py-7 px-6 sm:px-11 min-h-[80vh]">
        <div className="flex flex-col items-start gap-3">
          <span className="text-xl text-[#ffffff]">Dashboard</span>
          {false ? (
            <Skeleton
              sx={{ bgcolor: "#ffffff46" }}
              variant="rounded"
              width={"100%"}
              height={90}
            />
          ) : (
            <div className="flex justify-between items-start sm:items-end w-full sm:flex-row flex-col gap-4">
              <div className="box-shadow bg-glass !backdrop-blur-xl border-gradient !m-0 min-w-[200px] w-full md:w-fit pr-[90px] pt-2 pb-4 pl-4 rounded-[10px] relative">
                <p className="text-gray-500">Current Balance</p>
                <p className="text-2xl mt-[0.5rem]">${balance?.toFixed(2)}</p>
                <Button
                  variant="contained"
                  className="!bg-[#0085FF] !absolute right-[10px] hover:scale-95 duration-150 bottom-[10px] !lowercase !p-1 !rounded-[10px]"
                  onClick={() => navigate("/history")}
                >
                  View
                </Button>
              </div>
              {balance >= 20 && (
                <Button
                  variant="contained"
                  className="!bg-red-600 !px-12"
                  onClick={() => setShowWithDraw(true)}
                >
                  Withdraw
                </Button>
              )}
            </div>
          )}
        </div>
        {dashboardLoading ? (
          <Skeleton
            sx={{ bgcolor: "#ffffff19" }}
            className="box-shadow mt-8"
            variant="rounded"
            width={"100%"}
            height={200}
          />
        ) : dashboardData?.data?.length ? (
          <div
            className="!mt-8 grid gap-8 overflow-auto md:overflow-visible md:justify-start justify-center"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 300px))",
            }}
          >
            {dashboardData?.data?.map((item, index) => (
              <div
                className="duration-150 relative z-20 !m-0 flex flex-col gap-3 bg-glass border-gradient !backdrop-blur-xl"
                key={index}
              >
                <div
                  className="absolute top-3 right-3 !rounded-none bg-glass p-3 cursor-pointer "
                  onClick={() => goToDetail(`/detail-product/${item?.id}`)}
                >
                  <IoSettingsOutline />
                </div>
                <div className="text-left flex flex-col">
                  <span className="text-[#5D9DD8] text-sm">Server Name</span>
                  {item?.hostname}
                </div>
                <div className="text-left flex flex-col">
                  <span className="text-[#5D9DD8] text-sm">Service Type</span>
                  {item?.planName}
                </div>
                <div className="text-left flex flex-col">
                  <span className="text-[#5D9DD8] text-sm">Specification</span>
                  {generateSpec(item)}
                </div>
                <div className="text-left flex flex-col">
                  <span className="text-[#5D9DD8] text-sm">IP</span>
                  {item?.main_ip}
                </div>
                <div className="text-left flex flex-col">
                  <span className="text-[#5D9DD8] text-sm">Region</span>
                  <div className="flex gap-2">
                    <img src={item?.flagUrl} alt="" className="w-[20px]" />{" "}
                    <p>{item?.location}</p>
                  </div>
                </div>
                {item?.main_ip === "0.0.0.0" ||
                item?.main_ip === "" ||
                item?.main_ip?.length === 0 ? (
                  <div>
                    <span className="text-[#5D9DD8] text-sm">Status</span>
                    <button
                      type="button"
                      className="inline-flex h-[100%] items-center text-white transition ease-in-out duration-150 cursor-auto"
                      disabled=""
                    >
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing
                    </button>
                  </div>
                ) : item.power_status === "running" ? (
                  <div className="text-left">
                    <span className="text-[#5D9DD8] text-sm">Status</span>
                    <div className="flex gap-2 items-center">
                      <img src={Running} alt="" className="w-[25px]" />{" "}
                      <p>Running</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-left flex gap-2">
                    <span className="text-[#5D9DD8] text-sm">Status</span>
                    <div className="flex gap-2 items-center">
                      <img src={Stop} alt="" /> <p>Stop</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="!mt-8 box-shadow w-full !backdrop-blur-xl bg-glass border-gradient !m-0 h-[200px] rounded-lg flex items-center justify-center">
            <span>No data to display</span>
          </div>
        )}
      </section>
    </>
  );
}

export default DApp;
