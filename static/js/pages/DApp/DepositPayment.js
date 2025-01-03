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
import { deposit } from "../../store/DappStore";
import { EthIcon, NavLogo, UsdtIcon } from "../../assets/svg";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SolanaLogo from "../../assets/image/Solana.png";

export default function Deposit({ onClose, address2 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: loginData, isLoading: loginLoading } = useSelector(
    (state) => state?.Dcloud?.login
  );
  function useWalletAddress() {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const ethersProvider = isConnected
      ? new BrowserProvider(walletProvider)
      : null;
    const signer = isConnected ? ethersProvider?.getSigner() : null;
    return { address, chainId, isConnected, ethersProvider, signer };
  }

  const [chainType, setChainType] = useState("");
  const handleChange = (event) => {
    setChainType(event?.target?.value);
  };

  const { address, chainId, isConnected, ethersProvider, signer } =
    useWalletAddress();
  const depositFunc = async (encdata, amount) => {
    let data = await fetch(
      `https://api.dcicloud.ai/deposit-e2189h9/${encdata}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          chain: chainType,
        }),
      }
    );
    data = await data?.json();

    // sendETH(data?.data?.value, data?.data?.destination);
    checkTransaction(data?.data?.IDTransaction);
    navigate(`/deposit/${data?.data?.IDTransaction}`);
  };

  const checkTransaction = async (id) => {
    dispatch(deposit(id));
  };

  const [money, setMoney] = useState(0);

  const clickHandle = (e) => {
    e?.stopPropagation();
    onClose(false);
  };

  const { data: depositData } = useSelector((state) => state?.Dcloud?.deposit);

  return (
    <section
      className="flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 backdrop-blur-md !z-[1201] bg-[rgba(0,0,0,.5)]"
      onClick={(e) => clickHandle(e)}
    >
      <div
        className="bg-glass border-gradient [&>*]:relative [&>*]:z-[20] rounded-lg w-[90%] lg:w-[500px] p-8 flex flex-col items-center justify-center text-white gap-2"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <h1 className="text-3xl mt-2">Top Up Balance</h1>
        <p className="text-md text-center mb-4 text-[#17FFD5]">
          Request Amount
        </p>
        <div className=" w-full">
          <form className="w-full rounded-[10px] p-6 flex flex-col gap-2 items-center justify-center">
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="networkName"
                className="text-[#5D9DD8] w-full text-center md:text-left"
              >
                Network name
              </label>
              <Select
                id="networkName"
                value={chainType}
                onChange={handleChange}
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
                  ".MuiSelect-select": {
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
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
                  color: "white",
                  backgroundImage:
                    "linear-gradient(to bottom, #0C0C0C66, #28282826)",
                  borderRadius: "15px",
                }}
              >
                {address2.startsWith("0x") === true ? (
                  <MenuItem value="ETH" className="flex gap-2 items-center">
                    <EthIcon />
                    Ethereum (ERC20)
                  </MenuItem>
                ) : (
                  <MenuItem value="SOL" className="flex gap-2 items-center">
                    <img src={SolanaLogo} alt="logo" className="w-[28px]" />
                    Solana (SOL)
                  </MenuItem>
                )}

                {address2.startsWith("0x") === true && (
                  <MenuItem
                    value="USDT-ERC20"
                    className="flex gap-2 items-center"
                  >
                    <UsdtIcon />
                    USDT (ERC20)
                  </MenuItem>
                )}
              </Select>
              <label
                htmlFor="networkName"
                className="text-[#5D9DD8] w-full text-center md:text-left mt-[2rem]"
              >
                Total Amount in USDT
              </label>
              <div
                className="gap-2 grid items-center w-full justify-between "
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
                }}
              >
                {[50, 100, 200].map((item, index) => (
                  <div
                    onClick={() => setMoney(item)}
                    key={index}
                    className={`bg-glass border-gradient [&>*]:relative [&>*]:z-[20] cursor-pointer hover:scale-95 duration-150 !m-0 font-bold w-full !py-2 !px-2 rounded-[5px] text-center`}
                  >
                    ${item}
                  </div>
                ))}
                <div className="w-full gap-1 flex items-center">
                  <span>$</span>
                  <input
                    type="text"
                    value={money}
                    id="networkName"
                    className="py-1 px-2 rounded-[5px] outline-none text-white w-full text-center bg-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0C0C0C66, #28282826)",
                    }}
                    onChange={(e) => setMoney(e?.target?.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={money < 1 || chainType?.length <= 0}
                className="!rounded-lg w-full disabled:cursor-not-allowed !px-11 !py-2 bg-[#17FFD5] disabled:bg-[rgba(23,255,213,.3)] !text-black self-center !mt-10 transition-all disabled:!text-white"
                onClick={() => {
                  depositFunc(loginData?.encdata, money);
                }}
              >
                Continue to Payment
              </button>
              <button
                type="button"
                className="!rounded-lg w-full !px-11 !py-2 text-[#17FFD5] self-center transition-all"
                onClick={() => {
                  onClose(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
