import React from "react";
import { Button } from "@mui/material";
import { WalletIcon } from "../../assets/svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Metamask from "../../assets/image/metamask.png";
import Phantom from "../../assets/image/Phantom.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

export default function WalletError({
  connectEthereumWallet,
  connectSolanaWallet,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <section className="my-6 mx-6 relative sm:mx-11 flex items-center justify-center min-h-[85vh]">
      <div className="flex flex-col items-center justify-center w-[100%] lg:w-[60vw] xl:w-[50vw] py-4 px-4 sm:px-14 gap-4 text-center">
        <Button
          variant="contained"
          onClick={handleOpen}
          className="bg-glass !backdrop-blur-xl !text-[#00E0FF] font-bold !py-4 !text-lg !px-8 border-gradient gap-2 items-center justify-center md:!flex !hidden hover:scale-95"
        >
          Connect Wallet
        </Button>
        <p className="md:px-12 text-[#97CDFF] -translate-y-14 md:-translate-y-0">
          to unlock access to our products and services. Your wallet connection
          ensures a seamless and secure experience as you explore and utilize
          our offerings. <br /> Thank you for joining us on this journey!
        </p>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="!backdrop-blur-lg bg-glass border-gradient">
          <button
            className="w-full h-[200px] text-white relative z-[20] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-500 rounded-[20px] flex flex-col items-center justify-center text-xl"
            onClick={() => {
              connectEthereumWallet();
              handleClose();
            }}
            style={{ fontWeight: "bolder" }}
          >
            <img src={Metamask} alt="logo" className="w-[100px]" />
            Connect Metamask Wallet
          </button>
          <button
            className="w-full h-[200px] text-white relative z-[20] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-500 rounded-[20px] flex flex-col items-center justify-center text-xl gap-2"
            onClick={() => {
              connectSolanaWallet();
              handleClose();
            }}
            style={{ fontWeight: "bolder" }}
          >
            <img
              src={Phantom}
              alt="logo"
              className="w-[100px] rounded-[30px]"
            />
            Connect Phantom Wallet
          </button>
        </Box>
      </Modal>
    </section>
  );
}
