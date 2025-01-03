import React, { useState } from "react";
import { ReceiptIcon } from "../../assets/svg";
import KubernetesIcon from "../../assets/image/Kubernetes-icon.svg";
import WithDraw from "../../pages/DApp/Withdraw";
import { AnimatePresence, motion } from "framer-motion";

export default function History() {
  const [showWithDraw, setShowWithDraw] = useState(false);

  const handleWithDraw = async () => {
    setShowWithDraw(true);
  };

  return (
    <div className="w-full p-5">
      <div className="hidden w-full pb-[100px]">
        <div className="w-full flex flex-col gap-10">
          <div className="w-full flex md:flex-row flex-col items-center md:items-end gap-3 justify-between">
            <div className="flex flex-col justify-start w-full md:w-fit gap-4">
              <span className="text-[#17FFD5] font-semibold">
                Account Balance
              </span>
              <div className="bg-[#162C45] rounded-lg flex flex-col items-center w-full md:px-[100px] py-[40px] md:py-[70px] justify-center">
                <span className="text-[48px] text-[#17FFD5]">$0</span>
                <span className="text-white opacity-50">Current Balance</span>
              </div>
            </div>
            <button className="bg-[#0167C5] w-full md:w-fit px-4 py-2 rounded-lg hover:scale-95 duration-150">
              Top up balance
            </button>
          </div>
          <div className="flex w-full flex-col items-start">
            <span className="text-[#17FFD5] font-semibold">
              Account Balance
            </span>
            <div className="w-full overflow-auto ">
              <table className="w-full min-w-[800px]">
                <thead className="">
                  <tr className="text-left bg-[#0A4780] font-normal ">
                    <td className="px-4 py-2 rounded-tl-lg">Description</td>
                    <td className="px-4 py-2">Date</td>
                    <td className="px-4 py-2">Amount</td>
                    <td className="px-4 py-2">Balance</td>
                    <td className="px-4 py-2">Status</td>
                    <td className="px-4 py-2 rounded-tr-lg">Receipt</td>
                  </tr>
                </thead>
                <tbody className="text-base bg-[#1F3A58]">
                  <tr>
                    <td className="px-4 py-3">Crypto Deposit (ETH)</td>
                    <td className="px-4 py-3">2024-03-06</td>
                    <td className="px-4 py-3">$20</td>
                    <td className="px-4 py-3">$100</td>
                    <td className="px-4 py-3">Complete</td>
                    <td className="px-4 py-3">
                      <ReceiptIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Crypto Deposit (ETH)</td>
                    <td className="px-4 py-3">2024-03-06</td>
                    <td className="px-4 py-3">$20</td>
                    <td className="px-4 py-3">$100</td>
                    <td className="px-4 py-3">Complete</td>
                    <td className="px-4 py-3">
                      <ReceiptIcon />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Crypto Deposit (ETH)</td>
                    <td className="px-4 py-3">2024-03-06</td>
                    <td className="px-4 py-3">$20</td>
                    <td className="px-4 py-3">$100</td>
                    <td className="px-4 py-3">Complete</td>
                    <td className="px-4 py-3">
                      <ReceiptIcon />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={() => handleWithDraw()}
            className="bg-[red] !w-[140px] md:w-fit px-4 py-2 rounded-lg hover:scale-95 duration-150 self-end"
          >
            Withdraw
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showWithDraw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WithDraw onClose={setShowWithDraw}></WithDraw>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="flex flex-col items-center justify-center relative  bg-[#162C45] h-[80vh] m-4">
        <div className="bg-[#223d5bc7] w-[80%] p-6 sm:p-20 flex flex-col rounded-lg items-center justify-center relative z-20">
          <h2 className="text-3xl text-[#17FFD5] text-center">Coming Soon!</h2>
          <p className="text-center">
            History of your <span className="text-[#17FFD5]">Deposit</span>
          </p>
        </div>
        <img
          src={KubernetesIcon}
          alt="Lubernetes"
          className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[200px] z-10"
        />
      </section>
    </div>
  );
}
