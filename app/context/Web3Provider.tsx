"use client";

import { memo, useEffect, useCallback, useState, createContext, useContext } from "react";
import { ThemeProvider } from "next-themes";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { Widget, useInitNear, useNear,useAccount } from "esm-near-social-vm";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupModal } from "@near-wallet-selector/modal-ui";

interface ProvidersProps {
  children: React.ReactNode;
}

// Context to store wallet-related functions
interface WalletContextType {
  requestSignIn: () => void;
  logOut: () => void;
  signedIn: boolean;
  signedAccountId: string | null;
  near: any;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Custom hook to access Wallet Context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a Web3Provider");
  }
  return context;
};

const getNetworkPreset = (networkId: string) => {
  switch (networkId) {
    case "mainnet":
      return {
        networkId,
        nodeUrl: "https://free.rpc.fastnear.com",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://nearblocks.io",
        indexerUrl: "https://api.kitwallet.app",
      };
    case "testnet":
      return {
        networkId,
        nodeUrl: "https://test.rpc.fastnear.com",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://testnet.nearblocks.io",
        indexerUrl: "https://testnet-api.kitwallet.app",
      };
    default:
      throw Error(`Failed to find config for: '${networkId}'`);
  }
};

const Web3Provider: React.FC<ProvidersProps> = ({ children }) => {
  const [walletModal, setWalletModal] = useState<any>(null);
  const [signedIn, setSignedIn] = useState(false);
  // const [accountId, setAccountId] = useState<string | null>(null);
  const { initNear } = useInitNear();
  const near = useNear();
  const account = useAccount();
  const [signedAccountId, setSignedAccountId] = useState<string|null>(null);
  const accountId = account.accountId;

  useEffect(() => {
    const networkConfig = getNetworkPreset("testnet");
    const config = {
      networkId: "testnet",
      selector: setupWalletSelector({
        network: networkConfig,
        modules: [
          setupMyNearWallet({}),
          setupHereWallet({}),
        ],
      }),
    };

    initNear && initNear(config);
  }, [initNear]);

  useEffect(() => {
    if (!near) {
      return;
    }
    near.selector.then((selector) => {
      setWalletModal(
        setupModal(selector, { contractId: near.config.contractName })
      );
    });
  }, [near]);
  useEffect(() => {
    if (!near) {
      return;
    }
    setSignedIn(!!accountId);
    setSignedAccountId(accountId);
    // setConnected(true);
  }, [near, accountId]);

  const requestSignIn = useCallback(() => {
    if (walletModal) {
      walletModal.show();
    }
  }, [walletModal]);

  const logOut = useCallback(async () => {
    if (!near) {
      return;
    }
    const wallet = await (await near.selector).wallet();
    wallet.signOut();
    near.accountId = null;
    setSignedIn(false);
    setSignedAccountId(null);
  }, [near]);

  return (
    <WalletContext.Provider value={{ requestSignIn, logOut, signedIn, signedAccountId , near}}>
      <ThemeProvider>{children}</ThemeProvider>
    </WalletContext.Provider>
  );
};

export default Web3Provider;
