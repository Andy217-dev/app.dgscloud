import React from "react";
import NotFound from "../component/404/NotFound";
import Loading from "../component/Loading/Loading";
import Sidebar from "../pages/DApp/Partial/Sidebar.js";
import Support from "../pages/DApp/Support.js";
import CloudGPU from "../pages/DApp/CloudGPU";
import Kubernetes from "../pages/DApp/Kubernetes";
import Networking from "../pages/DApp/Networking";
import SharedCPU from "../pages/DApp/CloudCompute/SharedCPU.js";
import DedicatedCPU from "../pages/DApp/CloudCompute/DedicatedCPU.js";
import BareMetal from "../pages/DApp/CloudCompute/BareMetal.js";
import BlockStorage from "../pages/DApp/CloudStorage/BlockStorage.js";
import ObjectStorage from "../pages/DApp/CloudStorage/ObjectStorage.js";
import ManagedDatabase from "../pages/DApp/CloudStorage/ManagedDatabase.js";
import Deposit from "../pages/DApp/Deposit.js";
import History from "../pages/DApp/History.js";
const Main = React.lazy(() => import("../pages/Main/Main.js"));
const DetailProduct = React.lazy(() =>
  import("../pages/DApp/DetailProduct.js")
);
const DApp = React.lazy(() => import("../pages/DApp/"));

const { createBrowserRouter } = require("react-router-dom");

export const routerList = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "load",
    element: <Loading />,
  },
  {
    path: "/",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <DApp />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/deposit/:id",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Deposit />
      </React.Suspense>
    ),
  },
  {
    path: "/detail-product/:id_product",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <DetailProduct />
        </Sidebar>
      </React.Suspense>
    ),
  },

  {
    path: "/history",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <History />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/support",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <Support />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/cloudgpu",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <CloudGPU />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/kubernetes",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <Kubernetes />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/proxy",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <Networking />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/cloudcompute/sharedcpu",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <SharedCPU />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/cloudcompute/dedicatedcpu",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <DedicatedCPU />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/cloudcompute/baremetal",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <BareMetal />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/cloudstorage/blockstorage",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <BlockStorage />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/cloudstorage/objectstorage",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <ObjectStorage />
        </Sidebar>
      </React.Suspense>
    ),
  },
  {
    path: "/products/cloudstorage/manageddatabase",
    element: (
      <React.Suspense fallback={<Loading />}>
        <Sidebar>
          <ManagedDatabase />
        </Sidebar>
      </React.Suspense>
    ),
  },
]);
