"use client";

import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux"; // Renamed for clarity
import Web3Provider from "./Web3Provider";
import { store } from "../redux/store";

interface IProvidersProps {
  children: ReactNode;
}

const Providers = (props: IProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <Web3Provider>{props.children}</Web3Provider>
    </ReduxProvider>
  );
};

export default Providers;
