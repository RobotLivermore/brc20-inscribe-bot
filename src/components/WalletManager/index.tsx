"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { WalletCore } from "@/types/wallet";
import CreateOrRestoreWallet from "./CreateOrRestoreWallet";
import WalletOperator from "./WalletOperator";

const WalletManager: FC = () => {
  // const [wallet, setWallet] = useLocalStorage<WalletCore | null>(
  //   "localWallet",
  //   null
  // );
  const [wallet, setWallet] = useState<WalletCore | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const item = window.localStorage.getItem("localWallet");
      if (item) {
        setWallet(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return;
    }
  }, []);

  const saveWallet = useCallback((w: WalletCore | null) => {
    setWallet(w);
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem("localWallet", JSON.stringify(w));
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return;
    }
  }, []);
  if (wallet?.publicKey && wallet?.publicKey.length < 64) {
    setWallet(null);
  }

  const hasWallet = Boolean(wallet);
  return (
    <>
      {hasWallet && <WalletOperator wallet={wallet as WalletCore} />}
      {!hasWallet && (
        <CreateOrRestoreWallet
          onFinishCreateWallet={(w) => {
            saveWallet(w);
          }}
        />
      )}
    </>
  );
};

export default WalletManager;
