/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../../../styles/Dapp.css";
import { useDispatch, useSelector } from "react-redux";
import { login, isValid } from "../../../store/DappStore";
import { motion, AnimatePresence } from "framer-motion";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers/providers";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloudCompute from "../../../assets/image/Cloud_Compute.png";
import CloudGPU from "../../../assets/image/Cloud_GPU.png";
// import Kubernetes from "../../../assets/image/Kubernetes.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import WalletError from "../WalletError.js";
import CloseIcon from "@mui/icons-material/Close";
import dedicatedCPU from "../../../assets/image/dedicated.svg";
import bareMetal from "../../../assets/image/baremetal.png";
import { siderRouteDapp } from "../../../utils/RouteDapp.js";
import { Collapse } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  sharedCpuAMD,
  dashboard,
  sharedCpuIntel,
  dedicatedCpuGp,
  dedicatedCpu,
  dedicatedCpuMem,
  dedicatedCpuStore,
  bareMetalAmd,
  bareMetalIntel,
  cloudGPU,
} from "../../../store/DappStore";
import DepositPayment from "../DepositPayment.js";
import {
  DashboardIcon,
  MoreIcon,
  NavLogo,
  ProductsIcon,
  SupportIcon,
  WalletIcon,
  WalletPlusIcon,
} from "../../../assets/svg/index.js";
import { clusterApiUrl } from "@solana/web3.js";
import { ethers } from "ethers";

const drawerWidth = 280;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme?.spacing(3),
    transition: theme?.transitions?.create("margin", {
      easing: theme?.transitions?.easing?.sharp,
      duration: theme?.transitions?.duration?.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme?.transitions?.create("margin", {
        easing: theme?.transitions?.easing?.easeOut,
        duration: theme?.transitions?.duration?.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme?.transitions?.create(["margin", "width"], {
    easing: theme?.transitions?.easing?.sharp,
    duration: theme?.transitions?.duration?.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme?.transitions?.create(["margin", "width"], {
      easing: theme?.transitions?.easing?.easeOut,
      duration: theme?.transitions?.duration?.enteringScreen,
    }),
    backgroundColor: "#162536",
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme?.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const projectId = "15e4858679f87a994c0c5be4e43bc16f";

const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://mainnet.infura.io/v3/b612c14cc3544b949550ffed3d6c85d5",
};

const solanaConfig = {
  network: clusterApiUrl("mainnet-beta"),
};

// const binance = {
//   chainId: 56,
//   name: "Binance Smart Chain",
//   currency: "BNB",
//   explorerUrl: "https://bscscan.com",
//   rpcUrl: "https://bsc-dataseed.binance.org/",
// };

// const polygon = {
//   chainId: 137,
//   name: "Polygon",
//   currency: "MATIC",
//   explorerUrl: "https://polygonscan.com",
//   rpcUrl:
//     "https://polygon-mainnet.infura.io/v3/b612c14cc3544b949550ffed3d6c85d5",
// };

// const avalanche = {
//   chainId: 43114,
//   name: "Avalanche",
//   currency: "AVAX",
//   explorerUrl: "https://cchain.explorer.avax.network",
//   rpcUrl:
//     "https://avalanche-mainnet.infura.io/v3/b612c14cc3544b949550ffed3d6c85d5",
// };

const metadata = {
  name: "Decentralize Cloud Infrastructure",
  description: "Dapp DCI Wallet Connect Modal",
  url: "https://dapp.dcicloud.ai",
  icons: [
    "https://www.dextools.io/resources/tokens/logos/ether/0xc6221ac4e99066ea5443acd67d6108f874e2533d.png?1711456824666",
  ],
};

const web3Modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet], // Only applicable for Ethereum wallets
  projectId,
  enableAnalytics: true,
  wallets: [
    // Solana wallet integration is handled separately
  ],
});

function useEthereumWallet() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const ethersProvider = isConnected
    ? new ethers.BrowserProvider(walletProvider)
    : null;
  const signer = isConnected ? ethersProvider.getSigner() : null;

  return { address, chainId, isConnected, ethersProvider, signer };
}

function DApp({ children }) {
  const [showRequest, setShowRequest] = useState(false);
  const [openCollapse, setOpenCollapse] = React.useState({});
  const [openCore, setOpenCore] = React.useState({});
  useEffect(() => {
    dispatch(sharedCpuAMD());
    dispatch(sharedCpuIntel());
    dispatch(dedicatedCpuGp());
    dispatch(dedicatedCpu());
    dispatch(dedicatedCpuMem());
    dispatch(dedicatedCpuStore());
    dispatch(bareMetalIntel());
    dispatch(bareMetalAmd());
    dispatch(cloudGPU());
  }, []);
  const navigate = useNavigate();
  const [showDeposit, setShowDeposit] = useState(false);
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [balance, setBalance] = useState(0);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [state2, setState2] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [deployShort, setDeployShort] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    toggleDrawer2("left", false);
    if (
      event?.type === "keydown" &&
      (event?.key === "Tab" || event?.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const toggleDrawer2 = (anchor, open) => (event) => {
    toggleDrawer("left", false);
    if (
      event?.type === "keydown" &&
      (event?.key === "Tab" || event?.key === "Shift")
    ) {
      return;
    }

    setState2({ ...state2, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : "100vw",
        height: "100vh",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <nav className="flex justify-between items-center bg-[#162536] p-4 text-white">
        <p>All Products</p>
        <CloseIcon onClick={toggleDrawer(anchor, false)}></CloseIcon>
      </nav>
      <List
        className="bg-[#0C1A2A] h-screen grid grid-cols-1 gap-4 !py-14 justify-center justify-items-center"
        style={{ minHeight: "calc(100vh - 56px - 120px)" }}
      >
        {[
          {
            text: "Shared CPU",
            img: CloudCompute,
            url: "/products/cloudcompute/sharedcpu",
          },
          {
            text: "Dedicated CPU",
            img: dedicatedCPU,
            url: "/products/cloudcompute/dedicatedcpu",
          },
          {
            text: "Bare Metal",
            img: bareMetal,
            url: "/products/cloudcompute/baremetal",
          },
          {
            text: "Cloud GPU",
            img: CloudGPU,
            url: "/products/cloudgpu",
          },
          {
            text: "Proxy",
            img: CloudGPU,
            url: "/products/proxy",
          },
        ].map(({ text, img, url }, index) => (
          <ListItem
            key={text}
            disablePadding
            className="bg-transparent !w-[70vw] md:!w-[50vw] !rounded-[15px]"
            onClick={() => navigate(url)}
          >
            <ListItemButton className="flex flex-col items-center justify-center text-white  !p-3 !pb-2">
              <img src={img} alt="" className="w-[40px]" />
              <ListItemText primary={text} className="text-white" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const list2 = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : "100vw" }}
      role="presentation"
      onClick={toggleDrawer2(anchor, false)}
      onKeyDown={toggleDrawer2(anchor, false)}
    >
      <>
        <nav className="flex justify-between items-center bg-[#162536] p-4 text-white">
          <p>More</p>
          <CloseIcon onClick={toggleDrawer2(anchor, false)}></CloseIcon>
        </nav>
        <List
          className="bg-[#0C1A2A] grid grid-cols-1 gap-4 !py-14 justify-center justify-items-center"
          style={{ minHeight: "calc(100vh - 56px)" }}
        >
          <div className="bg-[#1B2D42] flex flex-col items-center justify-center rounded-[15px] !w-[70vw] md:!w-[50vw] text-white gap-2">
            <div className="bg-[#0A4780] px-6 py-2 text-lg rounded-[10px]">
              {address?.substring(0, 10) || solanaPublicKey?.substring(0, 9)}...
            </div>
            <div className="flex flex-col items-center justify-center my-4">
              <p className="text-gray-500">Account Balance</p>
              <p className="text-3xl">{balance?.toFixed(2)}$</p>
            </div>
            <Button
              variant="contained"
              onClick={() => {
                setShowRequest(true);
                setShowDeposit(false);
              }}
              className="flex items-center justify-center gap-4 !text-[1.2rem] capitalize !w-[80%] rounded-[10px]"
            >
              <WalletPlusIcon />
              <p>Top up</p>
            </Button>
          </div>
          {[
            {
              text: "Dashboard",
              img: <DashboardIcon className="w-[60px]" />,
              url: "/",
            },
            {
              text: "Support",
              img: <SupportIcon className="w-[60px]" />,
              url: "/support",
            },
          ].map(({ text, img, url }, index) => (
            <ListItem
              key={text}
              disablePadding
              className="bg-transparent !w-[70vw] md:!w-[50vw] !rounded-[15px]"
              onClick={() => navigate(url)}
            >
              <ListItemButton className="flex flex-col items-center justify-center text-white gap-2 !p-3 !pb-2">
                {img}
                <ListItemText primary={text} className="text-white" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    </Box>
  );

  useEffect(() => {
    const handleResize = () => {
      setOpen(window?.innerWidth > 875);
    };

    window?.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [isPhantomConnected, setIsPhantomConnected] = useState(false);
  const [solanaPublicKey, setSolanaPublicKey] = useState(null);
  const { address, chainId, isConnected, ethersProvider, signer } =
    useEthereumWallet();
  const dispatch = useDispatch();
  const { data: loginData, isLoading: loginLoading } = useSelector(
    (state) => state?.Dcloud?.login
  );
  const { data: isValidData, isLoading: isValidLoading } = useSelector(
    (state) => state?.Dcloud?.isValid
  );
  const showSummary = useSelector((state) => state?.Dcloud?.showSummary);

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

  useEffect(() => {
    dispatch(sharedCpuAMD());
    if (loginData?.encdata) {
      dispatch(dashboard(loginData?.encdata));
    }
  }, [loginData?.encdata]);

  const connectEthereumWallet = async () => {
    try {
      const instance = await web3Modal.open();
      const provider = new ethers.BrowserProvider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Ethereum Wallet Connected:", address);
    } catch (err) {
      console.error("Ethereum wallet connection failed:", err);
    }
  };

  const connectPhantomWallet = async () => {
    if (window.solana) {
      try {
        const response = await window.solana.connect();
        setSolanaPublicKey(response.publicKey.toString());
        setIsPhantomConnected(true);
      } catch (err) {
        console.error("Error connecting to Phantom wallet:", err);
        alert("Phantom wallet not found. Please create an account");
      }
    } else {
      alert("Phantom wallet not found. Please install it.");
    }
  };

  const disconnectWallet = async () => {
    window?.localStorage?.clear();
  };

  useEffect(() => {
    if (isConnected === true && address?.length > 0) {
      dispatch(login(address));
    }

    if (isPhantomConnected === true && solanaPublicKey?.length > 0) {
      dispatch(login(solanaPublicKey));
    }
  }, [isConnected, isPhantomConnected]);

  useEffect(() => {
    if (isValidLoading !== true) {
      if (isValidData?.error?.length > 0) {
        disconnectWallet();
      } else {
        setBalance(isValidData?.data?.balance);
      }
    }
  }, [isValidData, isValidLoading]);

  useEffect(() => {
    if (loginLoading !== true) {
      dispatch(isValid(loginData?.encdata));
    }
  }, [loginData, loginLoading]);

  const handleOpenCoreMenu = (id) => {
    setOpenCore((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleClickCollapse = (id) => {
    if (open === false) {
      setOpen(true);
    }
    setOpenCollapse((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const drawer = (
    <div>
      {siderRouteDapp?.map((data, i) => {
        return data?.subMenu ? (
          <ListItem
            key={i}
            disablePadding
            className={`!rounded-lg !overflow-hidden ${
              openCollapse[data?.id] ? "" : ""
            }`}
            sx={{ display: "block" }}
            onClick={() => (open ? "" : handleDrawerClose())}
          >
            <ListItemButton
              onClick={() => handleClickCollapse(data?.id)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {data?.icon}
              </ListItemIcon>
              <ListItemText
                primary={data?.name}
                sx={{ display: open ? "" : "none" }}
              />
              <ExpandMore
                sx={{
                  display: open ? "" : "none",
                  transition: "transform 0.2s ease-in-out",
                  transform: openCollapse[data?.id] ? "rotate(180deg)" : "",
                }}
              />
            </ListItemButton>
            <Collapse
              in={openCollapse[data?.id]}
              className="!bg-gradient-to-r from-[#2E5A8D] to-transparent rounded-lg mt-1"
              timeout="auto"
            >
              {data?.subMenu?.map((sub, index) => {
                return sub?.coreMenu ? (
                  <div
                    key={index}
                    className="rounded-lg hover:bg-[#ffffff0e] pl-8"
                  >
                    <div className="border-l border-[#5D9DD8]">
                      <ListItemButton
                        className="hover:!bg-transparent !pl-5"
                        key={index}
                        sx={{ pl: 4 }}
                        selected={sub.name === "List" ? true : false}
                        onClick={() => handleOpenCoreMenu(sub?.coreId)}
                      >
                        <div className="flex items-center justify-between w-full pr-1">
                          <div className="flex items-center gap-2 w-full">
                            {sub?.icon}
                            <ListItemText primary={sub?.name} />
                          </div>
                          <ExpandMore
                            sx={{
                              display: open ? "" : "none",
                              transition: "transform 0.2s ease-in-out",
                              transform: openCore[sub?.coreId]
                                ? "rotate(180deg)"
                                : "",
                            }}
                          />
                        </div>
                      </ListItemButton>
                      <Collapse in={openCore[sub?.coreId]} timeout="auto">
                        {sub?.coreMenu.map((res, index) => (
                          <NavLink
                            className="hover:bg-[#ffffff18]"
                            key={index}
                            to={res?.link}
                          >
                            <div className="!pl-8">
                              <div className="!border-[#5D9DD8] !border-l  ">
                                <ListItemButton
                                  className="hover:!bg-[#ffffff18] !rounded-lg "
                                  key={index}
                                  selected={sub?.name === "List" ? true : false}
                                >
                                  <div className="flex items-center gap-2 w-full ">
                                    <ListItemText primary={res?.name} />
                                  </div>
                                </ListItemButton>
                              </div>
                            </div>
                          </NavLink>
                        ))}
                      </Collapse>
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="rounded-lg hover:bg-[#ffffff0e] pl-8"
                  >
                    <div className="border-l border-[#5D9DD8]">
                      <NavLink to={sub?.link}>
                        <ListItemButton
                          className="hover:!bg-transparent !pl-5"
                          key={index}
                          sx={{ pl: 4 }}
                          selected={sub?.name === "List" ? true : false}
                        >
                          <div className="flex items-center gap-2 w-full">
                            {sub?.icon}
                            <ListItemText primary={sub?.name} />
                          </div>
                        </ListItemButton>
                      </NavLink>
                    </div>
                  </div>
                );
              })}
            </Collapse>
          </ListItem>
        ) : (
          <ListItem
            key={i}
            disablePadding
            className="!rounded-lg "
            sx={{ display: "block" }}
            onClick={() => (open ? "" : handleDrawerClose())}
          >
            <NavLink to={data?.link}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {data?.icon}
                </ListItemIcon>
                <ListItemText
                  primary={data?.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </NavLink>
          </ListItem>
        );
      })}
    </div>
  );

  return (
    <div className="w-full h-full bg-dapp">
      <Box className="hidden lg:flex [&>*]:!shadow-none">
        {/* <CssBaseline /> */}
        <AppBar
          position="fixed"
          open={open}
          className="!bg-gradient-to-r from-[#021525] to-[#1e3e63] !z-[21]"
          style={{
            zIndex: showSummary ? -1 : undefined, // Conditionally set z-index
          }}
        >
          <Toolbar>
            <div className="flex w-full justify-between items-center">
              <div className="flex">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: "none" }) }}
                >
                  <MenuIcon />
                </IconButton>
                {isConnected ||
                  (isPhantomConnected && (
                    <div className="relative">
                      <Button
                        variant="contained"
                        className="!px-6 !py-3 !text-[#00E0FF] !min-w-[150px] bg-glass !backdrop-blur-xl"
                        onClick={() => setDeployShort(!deployShort)}
                      >
                        Deploy New Server
                      </Button>
                      <AnimatePresence>
                        {deployShort === true && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="absolute top-[140%] left-0 flex flex-col bg-[#2A4A6F] p-2 rounded-[5px] w-[220px]">
                              {[
                                {
                                  text: "Add Shared CPU",
                                  img: CloudCompute,
                                  url: "/products/cloudcompute/sharedcpu",
                                },
                                {
                                  text: "Add Dedicated CPU",
                                  img: dedicatedCPU,
                                  url: "/products/cloudcompute/dedicatedcpu",
                                },
                                {
                                  text: "Add Bare Metal",
                                  img: bareMetal,
                                  url: "/products/cloudcompute/baremetal",
                                },
                                {
                                  text: "Add Cloud GPU",
                                  img: CloudGPU,
                                  url: "/products/cloudgpu",
                                },
                              ].map(({ text, img, url }) => (
                                <div
                                  onClick={() => {
                                    navigate(url);
                                    setDeployShort(false);
                                  }}
                                  className="flex gap-2 items-center justify-start p-2 cursor-pointer"
                                >
                                  <img src={img} alt="" className="w-[30px]" />
                                  <p>{text}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
              </div>
              <div>
                {isConnected || isPhantomConnected ? (
                  <div className="flex items-center justify-center relative p-2 gap-2 z-[20]">
                    <div className=" rounded-[10px] flex flex-col items-center justify-center transition-all !p-0 !m-0">
                      <button
                        className="!text-[#00E0FF] items-center justify-center !bg-[#0C1A27] !rounded-[20px] flex gap-2!px-6 !p-3 !m-0 transition-all"
                        // onClick={() => navigate("/history")}
                      >
                        <p className="leading-[.7rem] text-[1.1rem]">
                          ${balance?.toFixed(2)}
                        </p>
                      </button>
                    </div>
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className=" rounded-[10px] flex flex-col items-center justify-center hover:scale-95 transition-all !p-0 !m-0">
                          <button
                            onClick={() => {
                              // navigate("/dapp/deposit/payment");
                              setShowRequest(true);
                              setShowDeposit(false);
                            }}
                            className="!p-1 w-full rounded-[10px] flex gap-3 items-center justify-center !text-[#00E0FF] !backdrop-blur-xl bg-glass border-gradient"
                          >
                            <p>Top Up</p>
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <div className="!m-4 !my-0 h-[50px] w-[1px] bg-[rgba(255,255,255,0.3)]"></div>
                    <div className="rounded-[10px] flex flex-col items-center justify-center hover:scale-95 transition-all !p-0 !m-0">
                      <button
                        onClick={() => {
                          if (isConnected) {
                            web3Modal?.open();
                          }
                        }}
                        className="!m-0 !rounded-[10px] !text-[#00E0FF] bg-glass !backdrop-blur-xl border-gradient hover:scale-95 transition-all !p-1 !px-3"
                      >
                        {address?.substring(0, 9) ||
                          solanaPublicKey?.substring(0, 9)}
                        ...
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "transparent",
              color: "white",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
          hideBackdrop
          className="removeScrollBar"
        >
          <DrawerHeader className="flex !justify-between w-full !pl-6">
            <Link to={"/"}>
              <NavLogo className="w-[40px]" />
            </Link>
            {/* <IconButton onClick={handleDrawerClose}>
              {theme?.direction === "ltr" ? (
                <ChevronLeftIcon className="text-white" />
              ) : (
                <ChevronRightIcon className="text-white" />
              )}
            </IconButton> */}
          </DrawerHeader>
          <Divider />
          <List
            style={{ flex: 1 }}
            className="!no-scrollbar !px-2 gap-2 flex flex-col"
          >
            {drawer}
          </List>
          <List>
            <Link to={"https://dcicloud.ai/"}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon className="text-white">
                    <ArrowBackIcon style={{ color: "#FFF" }} />
                  </ListItemIcon>
                  <ListItemText primary={"Back"} />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        </Drawer>
        <Main open={open} className="!p-0 min-h-[100vh] text-white">
          <div className="h-[64px]"></div>
          {isConnected || isPhantomConnected ? (
            children
          ) : (
            <WalletError
              connectEthereumWallet={connectEthereumWallet}
              connectSolanaWallet={connectPhantomWallet}
            ></WalletError>
          )}
        </Main>
      </Box>
      <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
      >
        {list("left")}
      </Drawer>
      <Drawer
        anchor={"left"}
        open={state2["left"]}
        onClose={toggleDrawer2("left", false)}
      >
        {list2("left")}
      </Drawer>
      <div className="bg-dapp block fixed bottom-0 w-full h-screen overflow-scroll lg:hidden ] text-white">
        <nav className="bg-[#162536] flex items-center justify-center py-2">
          <NavLogo className=" w-[40px] h-[47px]" />
        </nav>
        {isConnected || isPhantomConnected ? (
          children
        ) : (
          <WalletError></WalletError>
        )}
        {isConnected || isPhantomConnected ? (
          <footer
            style={{
              zIndex: showSummary ? -1 : undefined,
            }}
            className="flex items-center sticky w-full bottom-0 left-0 min-h-[80px] bg-[#162536] z-[99999]"
          >
            <button
              onClick={toggleDrawer("left", true)}
              className="w-full h-full flex items-center !normal-case justify-between flex-col gap-2"
            >
              <ProductsIcon className="h-[30px] w-[35px] sm:h-[50px]" />
              <p className="text-white text-[0.9rem] sm:text-[1.1rem]">
                Products
              </p>
            </button>
            <button
              onClick={() => {
                toggleDrawer("left", true);
                navigate("/");
              }}
              className=" w-full h-full flex items-center !normal-case justify-center flex-col gap-2"
            >
              <DashboardIcon className="h-[30px] w-[35px] sm:h-[50px]" />
              <p className="text-white text-[0.9rem] sm:text-[1.1rem]">
                Dashboard
              </p>
            </button>
            <button
              onClick={toggleDrawer2("left", true)}
              className=" w-full h-full flex items-center !normal-case justify-center flex-col gap-2"
            >
              <MoreIcon className="h-[30px] w-[35px] sm:h-[50px]" />
              <p className="text-white text-[0.9rem] sm:text-[1.1rem]">More</p>
            </button>
          </footer>
        ) : (
          <button
            onClick={connectEthereumWallet}
            className="w-full bg-[#0E69BD] hover:bg-[#0085FF] text-white flex gap-4 items-cener justify-center py-6 sticky bottom-0 left-0"
          >
            <WalletIcon />{" "}
            <p className="leading-[1.7rem] text-xl">Connect Wallet</p>
          </button>
        )}
      </div>
      <AnimatePresence>
        {showRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DepositPayment
              onClose={setShowRequest}
              address2={address || solanaPublicKey}
            ></DepositPayment>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DApp;
