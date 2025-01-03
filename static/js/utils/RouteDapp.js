import {
  CloudComputeIcon,
  CloudGpuIcon,
  CloudStorageIcon,
  DashboardIcon,
  KubernetesIcon,
  NetworkingIcon,
  ProductsIcon,
  SupportIcon,
} from "../assets/svg";
import DotSvg from "../assets/image/dotSvg.svg";

export const siderRouteDapp = [
  {
    id: 0,
    name: "Dashboard",
    link: "/",
    icon: <DashboardIcon className="w-[30px] h-[30px]" />,
  },
  {
    coreId: 1,
    name: "Cloud Compute",
    icon: <CloudComputeIcon className="w-[30px] h-[30px]" />,
    subMenu: [
      {
        name: "Shared CPU",
        link: "/products/cloudcompute/sharedcpu",
        icon: <img src={DotSvg} alt="dkfjvn" className="w-[20px] h-[20px]" />,
      },
      {
        name: "Dedicated CPU",
        link: "/products/cloudcompute/dedicatedcpu",
        icon: <img src={DotSvg} alt="dkfjvn" className="w-[20px] h-[20px]" />,
      },
      {
        name: "Bare Metal",
        link: "/products/cloudcompute/baremetal",
        icon: <img src={DotSvg} alt="dkfjvn" className="w-[20px] h-[20px]" />,
      },
    ],
  },
  {
    name: "Cloud GPU",
    link: "/products/cloudgpu",
    icon: <CloudGpuIcon className="w-[30px] h-[30px]" />,
  },
  {
    name: "Proxy",
    link: "/products/proxy",
    icon: <NetworkingIcon className="w-[30px] h-[30px]" />,
  },
  {
    id: 2,
    name: "Support",
    link: "/support",
    icon: <SupportIcon className="w-[30px] h-[30px]" />,
  },
];
