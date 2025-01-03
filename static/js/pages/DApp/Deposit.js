/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Copy from "../../assets/image/copy.svg";
import { Button } from "@mui/material";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers/providers";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../component/Loading/Loading";
import { deposit } from "../../store/DappStore";
import { useParams } from "react-router-dom";
import checked from "../../assets/image/check.svg";
import { useNavigate } from "react-router-dom";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Logo2 from "../../assets/image/DCI_Logo.svg";
import { EthIcon, UsdtIcon } from "../../assets/svg";
import SolanaLogo from "../../assets/image/Solana.png";
import Load from "../../assets/image/load.svg";
import Wallet from "../../assets/image/wallet.svg";
import Transfer from "../../assets/image/transfer.svg";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import WalletActive from "../../assets/image/walletActive.svg";
import TransferActive from "../../assets/image/transferActive.svg";

function Deposit() {
  const [error, setError] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const [type, setType] = React.useState("transfer");
  const navigate = useNavigate();
  let [count, setCount] = useState(3);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: depositData } = useSelector((state) => state?.Dcloud?.deposit);

  const [time, setTime] = useState({
    minute: depositData?.expiredAtStr?.split(":")[1] || 0,
    second: depositData?.expiredAtStr?.split(":")[2] || 0,
  });

  const [pay, setPay] = useState(false);

  useEffect(() => {
    setTime({
      minute: depositData?.expiredAtStr?.split(":")[1] || 0,
      second: depositData?.expiredAtStr?.split(":")[2] || 0,
    });

    let interval;
    if (depositData?.deposited === true) {
      interval = setInterval(() => {
        setCount((prev) => {
          let num = prev - 1;
          if (num === 0) {
            navigate("/");
          }
          return num;
        });
      }, [1000]);
    }

    return () => {
      clearInterval(interval);
    };
  }, [depositData]);

  useEffect(() => {
    let inter = setInterval(() => {
      dispatch(deposit(id));
    }, 3000);

    return () => clearInterval(inter);
  }, [id, dispatch]);

  const copyToClipboard = (text, name) => {
    const textToCopy = text;

    const textarea = document?.createElement("textarea");
    textarea.value = textToCopy;
    document?.body.appendChild(textarea);
    textarea?.select();
    document?.execCommand("copy");
    document?.body.removeChild(textarea);
  };

  const ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

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

  const sendETH = async (amount, address) => {
    const singers = await ethersProvider?.listAccounts();
    try {
      const tx = await singers[0]?.sendTransaction({
        to: address,
        value: ethers?.parseEther(amount),
      });
    } catch (e) {
      setError(true);
      if (e?.toString()?.includes("insufficient funds")) {
        alert("Insufficient funds");
      }
    }
  };

  const getValue = () => {
    if (depositData?.data?.chain === "ETH") {
      return (
        <div className="text-white flex gap-2 items-center">
          <EthIcon /> Ethereum (ERC20)
        </div>
      );
    } else if (depositData?.data?.chain === "USDT-ERC20") {
      return (
        <div className="text-white flex gap-2 items-center">
          <UsdtIcon /> USDT (ERC20)
        </div>
      );
    } else {
      return (
        <div className="text-white flex gap-2 items-center">
          <img src={SolanaLogo} alt="logo" className="w-[30px]" /> Solana (SOL)
        </div>
      );
    }
  };

  const sendUSDT = async (amount, destination) => {
    const signer = ethersProvider?.getSigner();
    const contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    try {
      const tx = await ethersProvider?.send("eth_sendTransaction", [
        {
          from: address,
          to: contractAddress,
          data: contract?.interface?.encodeFunctionData("transfer", [
            destination,
            ethers?.parseUnits(amount + "", 6),
          ]),
        },
      ]);
      // console log txhash
    } catch (e) {
      setError(true);
    }
  };

  const [solanaPublicKey, setSolanaPublicKey] = useState(null);
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      window.solana
        .connect({ onlyIfTrusted: true })
        .then((response) => {
          setSolanaPublicKey(response.publicKey.toString());
          setIsPhantomConnected(true);
        })
        .catch((err) => {
          console.error("Error connecting to Phantom wallet:", err);
        });
    } else {
      console.log("Phantom wallet not found.");
    }
  }, []);

  const sendSOL = async (amount) => {
    if (!isPhantomConnected || !solanaPublicKey) {
      console.error(
        "Phantom wallet is not connected or Solana public key is missing."
      );
      return;
    }

    try {
      // Initialize Solana connection
      const connection = new Connection(
        "https://solana-mainnet.g.alchemy.com/v2/hH_6a8UN_lzrFP4Yt7r33hjKZRaneqou",
        "confirmed"
      );
      // Or use an alternative endpoint
      const fromPubkey = new PublicKey(solanaPublicKey);
      const toPubkey = new PublicKey(
        "vwA38ADKcABSkLRJm8GEBuevcx36x6GfHMkhLPQVu3u"
      ); // Replace with the actual recipient public key

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      transaction.feePayer = fromPubkey;

      // Get recent blockhash
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign transaction
      const signedTransaction = await window.solana.signTransaction(
        transaction
      );

      // Send transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false }
      );

      // Confirm transaction
      await connection.confirmTransaction(signature, "confirmed");
    } catch (err) {}
  };

  const sendPayment = () => {
    if (depositData?.data?.chain === "ETH") {
      sendETH(depositData?.data?.value, depositData?.data?.destination);
    } else if (depositData?.data?.chain === "USDT-ERC20") {
      sendUSDT(depositData?.data?.value, depositData?.data?.destination);
    } else if (depositData?.data?.chain === "SOL") {
      sendSOL(depositData?.data?.value, depositData?.data?.destination);
    }
    setPay(true);
  };

  if (Object.keys(depositData)?.length === 0) {
    return <Loading></Loading>;
  }
  return (
    <section className=" flex items-center justify-center w-full h-[100vh] bg-[#0a1829]">
      <div className="bg-glass !backdrop-blur-lg border-gradient [&>*]:relative [&>*]:z-[20] w-[95%] sm:w-[80%] lg:w-[50%] p-8 flex flex-col items-center text-white gap-4 rounded-[10px] overflow-auto max-h-[100vh]">
        <h1 className="text-3xl mt-2">Top Up Balance</h1>
        <p className="text-md text-center mb-4 text-[#17FFD5]">Payment</p>
        <div className=" grid w-full grid-cols-2 md:grid-cols-2 items-center justify-center content-center justify-items-center gap-2">
          <div
            onClick={() => setType("transfer")}
            style={{
              color: type === "transfer" ? "#17FFD5" : "white",
              borderColor:
                type === "transfer" ? "#17FFD5 !important" : "transparent",
            }}
            className="cursor-pointer gap-2 !m-0 w-full flex-col font-semibold bg-glass border-gradient [&>*]:relative [&>*]:z-[20] min-h-[130px] flex items-center justify-center"
          >
            {type === "transfer" ? (
              <img src={TransferActive} alt="" />
            ) : (
              <img src={Transfer} alt="" />
            )}
            Transfer
          </div>
          <div
            onClick={() => setType("wallet")}
            style={{
              color: type === "wallet" ? "#17FFD5" : "white",
              borderColor:
                type === "wallet" ? "#17FFD5 !important" : "transparent",
            }}
            className="cursor-pointer gap-2 !m-0 w-full flex-col font-semibold bg-glass border-gradient [&>*]:relative [&>*]:z-[20] min-h-[130px] flex items-center justify-center"
          >
            {type === "wallet" ? (
              <img src={WalletActive} alt="" />
            ) : (
              <img src={Wallet} alt="" />
            )}
            Wallet Transfer
          </div>
        </div>
        {type === "transfer" ? (
          <div className="grid w-full gap-2 grid-cols-1 bg-glass border-gradient [&>*]:relative [&>*]:z-[20]">
            <form className="col-span-1 sm:col-span-2 w-full rounded-[10px] p-6 flex flex-col gap-4 items-center justify-center">
              <div className="flex flex-col gap-2 w-full">
                <label
                  htmlFor="networkName"
                  className="text-[#5D9DD8] text-[1rem]"
                >
                  Network Name
                </label>
                {/* <input type="text" id="networkName" value={getValue()} disabled /> */}
                <div className="py-1 px-4 rounded-[5px] outline-none text-black bg-glass disabled:bg-[#294463] disabled:text-[#cfcfcfcf]">
                  {getValue()}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="total" className="text-[#5D9DD8] text-[1rem]">
                  Total Amount of {depositData?.data?.chain}
                </label>
                <label
                  htmlFor="total"
                  className="grid w-full  rounded-[5px] items-center bg-glass"
                  style={{ gridTemplateColumns: "1fr 28px" }}
                >
                  <input
                    type="text"
                    id="total"
                    className="py-2 px-4 outline-none text-black bg-transparent w-full disabled:text-[#cfcfcfcf]"
                    value={depositData?.data?.value}
                    disabled
                  />
                  <div
                    className=" p-1 rounded-[5px] mr-[5px] cursor-pointer"
                    onClick={() =>
                      copyToClipboard(depositData?.data?.value, "Total Amount")
                    }
                  >
                    <img src={Copy} alt="" className="" />
                  </div>
                </label>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="address" className="text-[#5D9DD8] text-[1rem]">
                  Address
                </label>
                <label
                  htmlFor="address"
                  className="grid w-full bg-glass rounded-[5px] items-center"
                  style={{ gridTemplateColumns: "1fr 28px" }}
                >
                  <input
                    type="text"
                    id="address"
                    className="py-2 px-4 outline-none text-black bg-transparent w-full disabled:text-[#cfcfcfcf]"
                    value={depositData?.data?.destination}
                    disabled
                  />
                  <div
                    className=" p-1 rounded-[5px] mr-[5px] cursor-pointer"
                    onClick={() =>
                      copyToClipboard(depositData?.data?.destination, "Address")
                    }
                  >
                    <img src={Copy} alt="" />
                  </div>
                </label>
              </div>
              <div className="flex gap-2 self-start">
                <p className="text-center text-sm">
                  This address is valid for the specified period only:
                </p>
                <h2 className="text-sm text-[#17FFD5]">
                  00:{time?.minute}:{time?.second}
                </h2>
              </div>
              <div className="flex gap-4 self-start pl-[1rem]">
                <div className="w-[15px] h-[15px] rounded-[50%] bg-[#17FFD5] mt-[5px]"></div>
                <p className="text-[#17FFD5]">
                  Please double-check the recipient address and total amount
                  before transferring
                </p>
              </div>
            </form>
            <div className="gap-2 w-full p-4 rounded-[10px] flex flex-col items-center justify-center">
              <p className="text-[#5D9DD8]">
                Faster and more secure: use the QR code
              </p>
              <div className="bg-glass w-full p-4 flex items-center justify-center">
                <img
                  src={depositData?.data?.qrCodeDestination}
                  alt=""
                  className="w-[200px]"
                />
              </div>
              <p className="text-[#5D9DD8] mt-[2rem]">
                Once you have completed the transfer, please click the button
                below.
              </p>

              {check === false ? (
                <button
                  onClick={() => setCheck(true)}
                  className="w-full bg-[#17FFD5] font-semibold p-4 text-black text-2xl rounded-[10px]"
                >
                  Transferred
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center text-white transition ease-in-out duration-150 cursor-auto flex-col gap-2"
                  disabled=""
                >
                  {error ? (
                    <>
                      <ClearOutlinedIcon
                        fontSize="large"
                        className="!text-red-500"
                      />
                      <p>Transaction Failed</p>
                    </>
                  ) : depositData?.deposited === false ? (
                    <>
                      <img
                        src={Load}
                        alt="csd"
                        className="w-[40px] animate-spin"
                      />
                      <p className="text-[#17FFD5]">
                        Your transaction is processing
                      </p>
                    </>
                  ) : (
                    <>
                      <img src={checked} alt="" />
                      will be redirect to dashboard in {count}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="networkName"
                className="text-[#5D9DD8] text-[1rem]"
              >
                Total Payment
              </label>
              <div className="text-white py-1 px-4 rounded-[5px] outline-none text-black bg-glass disabled:bg-[#294463] disabled:text-[#cfcfcfcf]">
                {depositData?.data?.value} {depositData?.data?.chain}
              </div>
            </div>
            <div className="mb-[1rem] w-full flex flex-col items-center justify-center min-h-[100px] p-4 gap-2">
              <button
                className=" !text-xl !py-4 !px-12 !rounded-[10px] !capitalize bg-[#17FFD5] w-full text-black font-semibold"
                onClick={sendPayment}
              >
                Pay {depositData?.data?.value} {depositData?.data?.chain}
              </button>
            </div>
            {pay === false && depositData?.deposited === true && (
              <button
                type="button"
                className="inline-flex items-center text-white transition ease-in-out duration-150 cursor-auto flex-col gap-2"
                disabled=""
              >
                {error ? (
                  <>
                    <ClearOutlinedIcon
                      fontSize="large"
                      className="!text-red-500"
                    />
                    <p>Transaction Failed</p>
                  </>
                ) : depositData?.deposited === false ? (
                  <>
                    <img
                      src={Load}
                      alt="csd"
                      className="w-[40px] animate-spin"
                    />
                    <p className="text-[#17FFD5]">
                      Your transaction is processing
                    </p>
                  </>
                ) : (
                  <>
                    <img src={checked} alt="" />
                    will be redirect to dashboard in {count}
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Deposit;
