import React from "react";
import "./styles/App.css";
import { RouterProvider } from "react-router-dom";
import { routerList } from "./utils/Router";
import { Provider } from "react-redux";
import Store from "./store/Store";

function App() {
  return (
    <>
      <Provider store={Store}>
        <RouterProvider router={routerList} />
      </Provider>
    </>
  );
}

export default App;
