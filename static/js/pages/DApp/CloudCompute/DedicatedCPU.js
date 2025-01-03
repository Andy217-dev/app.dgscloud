import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Checks from "../../../assets/image/checks.svg";
import Loading from "../../../assets/image/Loading.svg";
import paymentCheck from "../../../assets/image/paymentCheck.svg";
import paymentFail from "../../../assets/image/paymentFail.svg";
import { useDispatch } from "react-redux";
import { dashboard } from "../../../store/DappStore";
import { storeSummary } from "../../../store/DappStore";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function SharedCPU() {
  const dispatch = useDispatch();
  const [checkStatus, setCheckStatus] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();
  const [plan, setPlan] = useState();
  const [serverSpec, setServerSpec] = useState("");
  const [Country, setCountry] = useState("");
  const [Os, setOs] = useState("");
  const [feature, setFeature] = useState([]);
  const [isChecked, setIsChecked] = useState([false, false, false]);
  const [hostName, setHostName] = useState("");
  const { data: GpData, isLoading: gpLoading } = useSelector(
    (state) => state?.Dcloud?.dedicatedCpuGp
  );
  const { data: CpuData, isLoading: cpuLoading } = useSelector(
    (state) => state?.Dcloud?.dedicatedCpu
  );
  const { data: MemData, isLoading: memLoading } = useSelector(
    (state) => state?.Dcloud?.dedicatedCpuMem
  );
  const { data: StoreData, isLoading: storeLoading } = useSelector(
    (state) => state?.Dcloud?.dedicatedCpuStore
  );
  const { data: loginData } = useSelector((state) => state?.Dcloud?.login);
  const [data, setData] = useState();

  const handleServerSpec = (event) => {
    setServerSpec(event?.target?.value);
    setCountry("");
    setOs("");
    setFeature([false, false, false]);
    setHostName("");
  };
  const handlePlan = (event) => {
    setPlan(event?.target?.value);
    if (event?.target?.value === "General Purpose Optimized Cloud") {
      setData(GpData);
    } else if (event?.target?.value === "CPU Optimized Cloud") {
      setData(CpuData);
    } else if (event?.target?.value === "Memory Optimized Cloud") {
      setData(MemData);
    } else if (event?.target?.value === "Storage Optimized Cloud") {
      setData(StoreData);
    }
    setServerSpec("");
    setCountry("");
    setOs("");
    setFeature([false, false, false]);
    setHostName("");
  };
  const handleCountry = (event) => {
    setCountry(event?.target?.value);
    setOs("");
    setFeature([false, false, false]);
    setHostName("");
  };
  const handleOs = (event) => {
    setOs(event?.target?.value);
    setFeature([false, false, false]);
    setHostName("");
  };
  const handleFeature = (value) => {
    if (feature?.includes(value) === false) {
      setFeature([...feature, value]);
    } else {
      setFeature(feature?.filter((item) => item !== value));
    }
    setHostName("");
  };

  const handleHostName = (e) => {
    const inputValue = e?.target?.value;
    const filteredValue = inputValue?.replace(/[^a-zA-Z0-9]/g, ""); // Remove non-alphanumeric characters
    setHostName(filteredValue);
  };

  const handleChange = (index) => {
    setIsChecked((prevState) => {
      const temp = [...prevState];
      temp[index] = !temp[index];
      return temp;
    });
  };

  const generatePrice = () => {
    let hasil = data?.data?.filter((item) => item.id === serverSpec)[0]
      ?.monthly_cost;
    if (isChecked[2] === true) {
      hasil +=
        data?.data?.filter((item) => item?.id === serverSpec)[0]?.monthly_cost *
        0.2;
    }
    if (isChecked[0] === true) {
      hasil += 10;
    }

    return hasil;
  };

  const checkout = async () => {
    const body = {
      region: data?.data
        ?.filter((items) => items?.id === serverSpec)[0]
        ?.locations?.filter((items) => items?.name === Country)[0]?.id,
      plan: data?.data?.filter((item) => item?.id === serverSpec)[0]?.id,
      os_id: data?.operating_system.filter((item) => item?.name === Os)[0]?.id,
      label: hostName,
      hostname: hostName,
      enable_ipv6: isChecked[1],
      backups: isChecked[2] === true ? "enabled" : "disabled",
      ddos_protection: isChecked[0],
      activation_email: false,
    };

    let data2 = await fetch(
      `https://api.dcicloud.ai/checkout/${loginData?.encdata}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    data2 = await data2?.json();

    if (data2?.error) {
      setCheckStatus("failed");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setCheckStatus("success");
      dispatch(dashboard(loginData?.encdata));
      setTimeout(() => {
        navigate(`/detail-product/${data2?.data?.id}`);
      }, 1500);
    }
  };

  if (gpLoading || cpuLoading || memLoading || storeLoading) {
    return (
      <section className="py-7 px-6 sm:px-11">
        <div className="bg-glass border-gradient !m-0 w-full rounded-[10px] !mt-4 p-6 flex gap-4 flex-col min-h-[75vh] animate-pulse"></div>
      </section>
    );
  }

  return (
    <section className="py-7 px-6 sm:px-11">
      <p className="text-[rgba(255,255,255,.5)] text-xl">Products</p>
      <p className="text-xl">Cloud Compute / Dedicated CPU</p>
      <form className="box-shadow bg-glass border-gradient !m-0 w-full rounded-[10px] !mt-4 p-6 flex gap-4 flex-col min-h-[75vh]">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col">
              <label
                htmlFor="plan"
                className="text-[rgba(255,255,255,.5)] text-lg "
              >
                Select the plan <span className="text-red-500">*</span>
              </label>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  id="plan"
                  value={plan}
                  onChange={(e) => handlePlan(e)}
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: "#223D5B",
                        color: "white",
                        borderRadius: "15px",
                      },
                    },
                  }}
                  sx={{
                    ".MuiMenuItem-root": { color: "white" },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "15px",
                    },
                    ".MuiOutlinedInput-notchedOutline ul": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "15px",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "15px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "15px",
                    },
                    ".MuiSvgIcon-root ": {
                      fill: "white !important",
                    },
                    color: "#17FFD5",
                    backgroundImage:
                      "linear-gradient(to bottom, #FFFFFF1F, #73737303)",
                    borderRadius: "15px",
                  }}
                >
                  <MenuItem value="General Purpose Optimized Cloud">
                    <em>General Purpose Optimized Cloud</em>
                  </MenuItem>
                  <MenuItem value="CPU Optimized Cloud">
                    CPU Optimized Cloud
                  </MenuItem>
                  <MenuItem value="Memory Optimized Cloud">
                    Memory Optimized Cloud
                  </MenuItem>
                  <MenuItem value="Storage Optimized Cloud">
                    Storage Optimized Cloud
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {plan?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col">
                <label
                  htmlFor="serverSpec"
                  className="text-[rgba(255,255,255,.5)] text-lg "
                >
                  Select the server specification{" "}
                  <span className="text-red-500">*</span>
                </label>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    id="serverSpec"
                    value={serverSpec}
                    onChange={handleServerSpec}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: "#223D5B",
                          color: "white",
                          borderRadius: "15px",
                        },
                      },
                    }}
                    sx={{
                      ".MuiMenuItem-root": { color: "white" },
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      ".MuiOutlinedInput-notchedOutline ul": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      ".MuiSvgIcon-root ": {
                        fill: "white !important",
                      },
                      color: "#17FFD5",
                      backgroundImage:
                        "linear-gradient(to bottom, #FFFFFF1F, #73737303)",
                      borderRadius: "15px",
                    }}
                  >
                    {data?.data?.map((item, index) => (
                      <MenuItem value={item?.id} key={index}>
                        <em>{item?.label}</em>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {serverSpec?.length > 0 && plan?.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col">
                <label
                  htmlFor="country"
                  className="text-[rgba(255,255,255,.5)] text-lg "
                >
                  Choose the Country(Data Center){" "}
                  <span className="text-red-500">*</span>
                </label>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    id="country"
                    value={Country}
                    onChange={handleCountry}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: "#223D5B",
                          color: "white",
                          borderRadius: "15px",
                        },
                      },
                    }}
                    sx={{
                      ".MuiMenuItem-root": { color: "white" }, // Set text color of MenuItem to white
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      ".MuiOutlinedInput-notchedOutline ul": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      ".MuiSvgIcon-root ": {
                        fill: "white !important",
                      },
                      color: "#17FFD5",
                      backgroundImage:
                        "linear-gradient(to bottom, #FFFFFF1F, #73737303)",
                      borderRadius: "15px",
                    }}
                  >
                    {data?.data
                      ?.filter((items) => items?.id === serverSpec)[0]
                      ?.locations.map((item, index) => (
                        <MenuItem value={item?.name} key={index}>
                          <em className="flex gap-2">
                            <img
                              src={item?.flagUrl}
                              alt=""
                              className="w-[20px] h-[20px]"
                            />
                            {item?.name}
                          </em>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </motion.div>
          ) : (
            ""
          )}
        </AnimatePresence>
        <AnimatePresence>
          {serverSpec?.length > 0 && plan?.length > 0 && Country?.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col">
                <label
                  htmlFor="opSystem"
                  className="text-[rgba(255,255,255,.5)] text-lg "
                >
                  Choose the Operating System{" "}
                  <span className="text-red-500">*</span>
                </label>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    id="opSystem"
                    value={Os}
                    onChange={handleOs}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        style: {
                          backgroundColor: "#223D5B",
                          color: "white",
                          borderRadius: "15px",
                        },
                      },
                    }}
                    sx={{
                      ".MuiMenuItem-root": { color: "white" }, // Set text color of MenuItem to white
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      ".MuiOutlinedInput-notchedOutline ul": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "15px",
                      },
                      ".MuiSvgIcon-root ": {
                        fill: "white !important",
                      },
                      color: "#17FFD5",
                      backgroundImage:
                        "linear-gradient(to bottom, #FFFFFF1F, #73737303)",
                      borderRadius: "15px",
                    }}
                  >
                    {data?.operating_system?.map((item, index) => (
                      <MenuItem value={item?.name} key={index}>
                        <em>{item?.name}</em>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </motion.div>
          ) : (
            ""
          )}
        </AnimatePresence>
        <AnimatePresence>
          {serverSpec?.length > 0 && plan?.length > 0 && Country?.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col">
                <label
                  htmlFor="feature"
                  className="text-[rgba(255,255,255,.5)] text-lg mb-2"
                >
                  Additional Features
                </label>
                <div className="max-w-[300px] mx-2 p-2  rounded-[15px] flex flex-col">
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        onChange={() => {
                          handleChange(0);
                          handleFeature("DDoS Protection");
                        }}
                        {...label}
                        sx={{
                          [`&, &.${checkboxClasses?.checked}`]: {
                            color: "#17FFD5",
                          },
                          [`&, &.false`]: {
                            color: "white",
                          },
                        }}
                      />
                    }
                    label="DDoS Protection"
                    labelPlacement="end"
                    className={`!ml-[0px] ${
                      isChecked[0] === true && "text-[#17FFD5]"
                    }`}
                  />
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        onChange={() => {
                          handleChange(1);
                          handleFeature("Enable IPv6");
                        }}
                        {...label}
                        sx={{
                          [`&, &.${checkboxClasses?.checked}`]: {
                            color: "#17FFD5",
                          },
                          [`&, &.false`]: {
                            color: "white",
                          },
                        }}
                      />
                    }
                    label="Enable IPv6"
                    labelPlacement="end"
                    className={`!ml-[0px] ${
                      isChecked[1] === true && "text-[#17FFD5]"
                    }`}
                  />
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        onChange={() => {
                          handleChange(2);
                          handleFeature("Enable Backups");
                        }}
                        {...label}
                        sx={{
                          [`&, &.${checkboxClasses?.checked}`]: {
                            color: "#17FFD5",
                          },
                          [`&, &.false`]: {
                            color: "white",
                          },
                        }}
                      />
                    }
                    label="Enable Backups"
                    labelPlacement="end"
                    className={`!ml-[0px] ${
                      isChecked[2] === true && "text-[#17FFD5]"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            ""
          )}
        </AnimatePresence>
        <AnimatePresence>
          {serverSpec?.length > 0 &&
          plan?.length > 0 &&
          Country?.length > 0 &&
          Os?.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col w-full">
                <label
                  htmlFor="hostname"
                  className="text-[rgba(255,255,255,.5)] text-lg mb-2"
                >
                  Hostname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="hostname"
                  value={hostName}
                  onChange={(e) => handleHostName(e)}
                  maxLength={63}
                  className="bg-white p-2 text-lg outline-none relative z-20 border border-[#ffffff4d] rounded-[10px] mx-[10px] text-black w-full"
                />
              </div>
            </motion.div>
          ) : (
            ""
          )}
        </AnimatePresence>
        <AnimatePresence>
          {serverSpec?.length > 0 &&
          plan?.length > 0 &&
          Country?.length > 0 &&
          Os?.length > 0 &&
          hostName?.length > 0 ? (
            <>
              <hr className="my-4 border-[#ffffff4d]" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="self-end w-full flex gap-2 items-center rounded-[10px] pr-2 overflow-hidden"
              >
                <Button
                  variant="contained"
                  className="w-full transition-all !text-black !rounded-[12px] !bg-[#00E0FF] hover:scale-95"
                  onClick={() => {
                    setShowSummary(true);
                    dispatch(storeSummary(true));
                  }}
                >
                  Proceed Order
                </Button>
              </motion.div>
            </>
          ) : (
            ""
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={(e) => {
                e?.stopPropagation();
                setShowSummary(false);
                dispatch(storeSummary(false));
              }}
              className="backdrop-blur-lg fixed top-0 left-0 w-[100vw] bg-[rgba(0,0,0,.8)] h-[100vh] z-[999999] flex justify-center items-center"
            >
              <div
                className="bg-glass flex flex-col p-4 gap-3 sm:w-auto w-[95vw] items-center border border-gradient rounded-[10px] max-h-[100vh] overflow-auto"
                onClick={(e) => {
                  e?.stopPropagation();
                }}
              >
                <h2 className="text-3xl mb-4">Order Summary</h2>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[#5D9DD8] text-sm">Selected Plan</p>
                  <div className="bg-glass text-[#17FFD5] w-full sm:w-[450px] p-2 px-5 rounded-[5px]">
                    {plan}
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[#5D9DD8] text-sm">Server Specification</p>
                  <div className="bg-glass text-[#17FFD5] w-full sm:w-[450px] p-2 px-5 rounded-[5px]">
                    {serverSpec}
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[#5D9DD8] text-sm">Server Location</p>
                  <div className="bg-glass text-[#17FFD5] w-full sm:w-[450px] p-2 px-5 rounded-[5px]">
                    {Country}
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-[#5D9DD8] text-sm">Operating System</p>
                  <div className="bg-glass text-[#17FFD5] w-full sm:w-[450px] p-2 px-5 rounded-[5px]">
                    {Os}
                  </div>
                </div>
                {isChecked?.some((item) => item === true) && (
                  <div className="flex flex-col self-start gap-1">
                    <p className=" text-sm text-[#5D9DD8]">
                      Additional Features
                    </p>
                    <div className="p-2 flex flex-col gap-2">
                      {isChecked[0] === true && (
                        <div className="flex gap-2 items-center">
                          <>
                            <img src={Checks} alt="" className="w-[20px]" />
                            DDoS Protection
                          </>
                        </div>
                      )}
                      {isChecked[1] === true && (
                        <div className="flex gap-2 items-center">
                          <img src={Checks} alt="" className="w-[20px]" />
                          Enable IPv6
                        </div>
                      )}
                      {isChecked[2] === true && (
                        <div className="flex gap-2 items-center">
                          <img src={Checks} alt="" className="w-[20px]" />
                          Enable Backups
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="w-[100%] h-[1px] bg-[#3E6693]"></div>
                <div className=" w-[100%] p-2 flex flex-col items-center justify-center rounded-[10px] gap-1">
                  <p className="text-sm text-[#5D9DD8]">Total Cost</p>
                  <h3 className="text-xl bg-[#1E1E1E] text-[#17FFD5] w-full p-2 text-center rounded-[10px]">
                    ${generatePrice()}/mo
                  </h3>
                </div>
                {checkStatus === "" && (
                  <Button
                    variant="contained"
                    className="!capitalize w-full font-extrabold !rounded-[10px] !text-[#1e1e1e] !bg-[#17FFD5]"
                    onClick={() => {
                      checkout();
                      setCheckStatus("loading");
                    }}
                  >
                    Continue to Payment
                  </Button>
                )}

                {checkStatus === "" && (
                  <Button
                    variant="contained"
                    className="!capitalize w-full font-bold !rounded-[10px] !bg-transparent !text-[#17FFD5]"
                    onClick={() => {
                      setShowSummary(false);
                      dispatch(storeSummary(false));
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {checkStatus === "success" ? (
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <img src={paymentCheck} alt="" className="w-[30px]" />
                    <p>Your transaction is successful</p>
                  </div>
                ) : checkStatus === "failed" ? (
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <img src={paymentFail} alt="" className="w-[30px]" />
                    <p>Insufficient balance</p>
                  </div>
                ) : checkStatus === "loading" ? (
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <img
                      src={Loading}
                      alt=""
                      className="animate-spin w-[30px]"
                    />
                    <p>Your Transaction is Processing..</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </section>
  );
}

// import React from "react";
// import KubernetesIcon from "../../../assets/image/Kubernetes-icon.svg";

// export default function DedicatedCPU() {
//   return (
//     <section className=" flex-col items-center flex justify-center relative  bg-[#162C45] h-[80vh] m-4">
//       <div className="bg-[#223d5bc7] w-[80%] p-6 sm:p-20 flex flex-col rounded-lg items-center justify-center relative z-20">
//         <h2 className="text-3xl text-[#17FFD5] text-center">Coming Soon!</h2>
//       </div>
//       <img
//         src={KubernetesIcon}
//         alt="Lubernetes"
//         className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[200px] z-10"
//       />
//     </section>
//   );
// }
