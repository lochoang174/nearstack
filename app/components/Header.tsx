"use client";

import "@near-wallet-selector/modal-ui/styles.css";
import { useAppSelector } from "../redux/store";
import { useWallet } from "../context/Web3Provider";
import Image from "@/assets/logo.png";
export default function Header() {
  // const dispatch = useAppDispatch()
  // const { wallet } = useAppSelector((state) => state.wallet);
  const { requestSignIn, logOut, signedIn, signedAccountId } = useWallet();

  const onConnectWalletClicked = async () => {
    requestSignIn()
  };

  return (
    <header className=" text-white">
      <div className="flex justify-between items-center px-6 ">
        {/* <span className="text-[20px] self-center font-semibold">
          Near-stack
        </span> */}
        <div className="flex items-center ">
        <img src={Image.src} className="w-auto h-[40px]" alt="Near Stack Logo"/>
          {/* <span className="text-[20px] self-center font-medium text-[#0CF25D]">
          Near-stack
        </span> */}
        </div>
        
        {signedAccountId?
        <div
        className="text-sm font-medium  text-[#0CF25D] px-4 py-2 rounded-lg cursor-pointer border-[2px] border-[#0CF25D] border-solid"
        onClick={logOut}
      >
        {signedAccountId}
      </div>:<div
          className="text-sm font-medium  text-[#0CF25D] px-4 py-2 rounded-lg cursor-pointer border-[2px] border-[#0CF25D] border-solid"
          onClick={onConnectWalletClicked}
        >
          Sign In
        </div>}
      </div>
    </header>
  );
}
