import { configureStore } from "@reduxjs/toolkit";
import Dcloud from "./DappStore";

let store = configureStore({
  reducer: {
    Dcloud,
  },
});

export default store;
