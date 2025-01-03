import React, { useState } from "react";
import Logo from "../../assets/image/Logo.png";
import Copy from "../../assets/image/copy.svg";
import QR from "../../assets/image/QR.png";
import { Button } from "@mui/material";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers/providers";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deposit, withDraw, login } from "../../store/DappStore";
import { NavLogo } from "../../assets/svg";
import Checks from "../../assets/image/paymentCheck.svg";
import Fail from "../../assets/image/paymentFail.svg";
import Web3 from "web3";

export default function Deposit({ onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: loginData, isLoading: loginLoading } = useSelector(
    (state) => state?.Dcloud?.login
  );
  const [drawAmount, setDrawAmount] = useState();
  const [drawLoading, setDrawLoading] = useState();
  function useWalletAddress() {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const ethersProvider = isConnected
      ? new BrowserProvider(walletProvider)
      : null;
    const signer = isConnected ? ethersProvider?.getSigner() : null;
    return { address, chainId, isConnected, ethersProvider, signer };
  }

  const { address, chainId, isConnected, ethersProvider, signer } =
    useWalletAddress();

  const checkTransaction = async (id) => {
    dispatch(deposit(id));
  };

  const [money, setMoney] = useState(0);

  const clickHandle = (e) => {
    e.stopPropagation();
    onClose(false);
  };

  const { data: isValidData, isLoading: isValidLoading } = useSelector(
    (state) => state?.Dcloud?.isValid
  );

  const [debounceTimer, setDebounceTimer] = useState(null);

  const requestWithdraw = (e) => {
    setMoney((prev) => {
      if (e.target.value > isValidData?.data?.balance) {
        return isValidData?.data?.balance?.toFixed(2);
      } else {
        return e?.target?.value;
      }
    });

    if (e?.target?.value >= 20) {
      clearTimeout(debounceTimer); // Clear the previous debounce timer

      const timer = setTimeout(async () => {
        setDrawLoading(true);
        let data = await fetch(
          `https://api.dcicloud.ai/simulation-withdraw/${e?.target?.value}`
        );
        data = await data?.json();

        setDrawAmount(data?.data);
        setDrawLoading(false);
      }, 1000); // Set a new debounce timer

      setDebounceTimer(timer); // Update the debounce timer state
    }
  };

  const [drawAddress, setDrawAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);

  const handleDrawAddress = (e) => {
    setDrawAddress(e?.target?.value);
    window.web3 = new Web3(window?.ethereum);
    window?.ethereum?.enable();
    const web3 = window.web3;
    const isValid = web3?.utils?.isAddress(e?.target?.value);
    setAddressValid(isValid);
  };

  const [loadingDraw, setLoadingDraw] = useState(false);

  const handleWithDraw = async () => {
    setLoadingDraw(true);
    let data = await fetch(
      `https://api.dcicloud.ai/withdraw-2rf378h/${loginData?.encdata}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: money,
          destination: address,
        }),
      }
    );

    await data?.json();
    setLoadingDraw(false);

    onClose(false);
    window?.location?.reload();
  };

  return (
    <section
      className="flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 backdrop-blur-md !z-[99999999]"
      onClick={(e) => clickHandle(e)}
    >
      <div
        className="bg-gradient-to-b from-[#345E8C] to-[#1C3A5A] rounded-lg w-[90%] lg:w-[600px] p-3 sm:p-8 flex flex-col items-center justify-center text-white gap-2"
        onClick={(e) => e?.stopPropagation()}
      >
        <NavLogo />
        <h1 className="text-3xl mt-2">Withdraw</h1>
        <p className="font-semibold text-lg text-center mb-4">Request Amount</p>
        <div className=" w-full">
          <form className="w-full rounded-[10px] p-3 sm:p-6 bg-[#254D7A] border border-[#87B6EB] flex flex-col gap-2 items-center justify-center">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="networkName"
                className="text-gray-400 w-full :text-left"
              >
                Balance
              </label>
              <div className="w-full gap-1 flex items-end text-white">
                <div className="flex items-center gap-1 w-fit">
                  <span className="text-lg">$</span>
                  <input
                    type="text"
                    value={isValidData?.data?.balance?.toFixed(2)}
                    disabled
                    id="networkName"
                    className="text-white py-1 px-2 text-[1.3rem] !text-bold rounded-[5px] outline-none  w-full bg-[#254466]"
                    onChange={(e) => setMoney(e?.target?.value)}
                  />
                </div>
              </div>
              <label
                htmlFor="networkName"
                className={`text-gray-400 w-full text-left mt-2`}
              >
                Withdraw amount
              </label>
              <div className="w-full gap-1 flex items-end text-white">
                <div className="flex items-center w-3/4 sm:w-1/4 gap-1">
                  <span className="text-lg">$</span>
                  <input
                    type="text"
                    value={money}
                    id="networkName"
                    className={`text-white py-1 px-2 rounded-[5px] outline-none  w-full text-center bg-[#5480B1]`}
                    onChange={(e) => {
                      requestWithdraw(e);
                    }}
                  />
                </div>
                <Button
                  variant="contained"
                  className="!h-[32px] !capitalize !text-md !px-1"
                  onClick={() =>
                    setMoney(isValidData?.data?.balance?.toFixed(2))
                  }
                >
                  max
                </Button>
                <p className="text-xs text-gray-400 sm:block hidden">
                  *minimum withdraw $20
                </p>
              </div>
              <p className="text-xs text-gray-400 sm:hidden block">
                *minimum withdraw $20
              </p>
              <label
                htmlFor="networkName"
                className="text-gray-400 w-full text-left mt-2"
              >
                Destination Address (ERC20)
              </label>
              <div className="w-full gap-1 flex items-end text-white">
                <div className="flex items-center w-full gap-1">
                  <span className="text-lg">$</span>
                  <div className="w-full flex gap-2">
                    <input
                      type="text"
                      value={drawAddress}
                      id="networkName"
                      className={`text-white py-1 px-2 !text-bold rounded-[5px] outline-none !w-full bg-[#5480B1] ${
                        addressValid
                          ? "border-2 border-[#20B1AA]"
                          : "border-2 border-red-500"
                      }`}
                      onChange={(e) => handleDrawAddress(e)}
                    />

                    <img
                      src={addressValid ? Checks : Fail}
                      alt=""
                      className="w-[20px]"
                    />
                  </div>
                </div>
              </div>
              <div className="w-[100%] h-[1px] bg-[#6FAAE0] mt-10"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 !mt-2 gap-2">
                <div className="w-full sm:text-start text-center">
                  <p className="text-gray-400">Network Fee</p>
                  {drawLoading === true ? (
                    <p className="animate-pulse w-[120px] h-[20px] bg-gray-400 sm:mx-0 mx-auto rounded-[5px]"></p>
                  ) : (
                    <h3 className={`text-md`}>
                      {drawAmount?.networkFee || "--"}
                    </h3>
                  )}
                  <p className="text-gray-400">Estimate Receive</p>
                  {drawLoading === true ? (
                    <p className="animate-pulse w-[120px] h-[20px] bg-gray-400 sm:mx-0 mx-auto rounded-[5px]"></p>
                  ) : (
                    <h3 className={`text-md`}>
                      {drawAmount?.received || "--"}
                    </h3>
                  )}
                </div>
                {loadingDraw === false ? (
                  <Button
                    onClick={handleWithDraw}
                    variant="contained"
                    disabled={money < 20 || addressValid === false}
                    className="!text-lg !ml-auto sm:!mr-0 !mr-auto !rounded-xl !px-11 !py-2  bg-gradient-to-b from-[#57AEFF] to-[#0D61AE] !w-fit self-center  transition-all disabled:!text-[#518BC1] disabled:from-[#336593] disabled:to-[#336593]"
                  >
                    Request
                  </Button>
                ) : (
                  <Button
                    onClick={handleWithDraw}
                    variant="contained"
                    disabled={money < 20 || addressValid === false}
                    className="!text-lg !ml-auto sm:!mr-0 !mr-auto !rounded-xl !px-11 !py-2  bg-gradient-to-b from-[#57AEFF] to-[#0D61AE] !w-fit self-center  transition-all disabled:!text-[#518BC1] disabled:from-[#336593] disabled:to-[#336593]"
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
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
