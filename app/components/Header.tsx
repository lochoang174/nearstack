"use client";

import "@near-wallet-selector/modal-ui/styles.css";
import { useAppSelector } from "../redux/store";
import { useWallet } from "../context/Web3Provider";
import Image from "@/assets/nearstack.png";
export default function Header() {
  // const dispatch = useAppDispatch()
  // const { wallet } = useAppSelector((state) => state.wallet);
  const { requestSignIn, logOut, signedIn, signedAccountId } = useWallet();

  const onConnectWalletClicked = async () => {
    requestSignIn()
  };

  return (
    <header className="bg-[#d7d9df] text-white">
      <div className="flex justify-between items-center px-6 ">
        {/* <span className="text-[20px] self-center font-semibold">
          Near-stack
        </span> */}
        <img src={Image.src} className="w-[100px] h-auto" alt="Near Stack Logo"/>
        {signedAccountId?
        <div
        className="text-sm font-medium bg-white text-black px-4 py-2 rounded cursor-pointer"
        onClick={logOut}
      >
        {signedAccountId}
      </div>:<div
          className="text-sm font-medium bg-[#0a132c] text-white px-4 py-2 rounded cursor-pointer hover:bg-white hover:text-black transition-all duration-300"
          onClick={onConnectWalletClicked}
        >
          Sign In
        </div>}
      </div>
    </header>
  );
}
