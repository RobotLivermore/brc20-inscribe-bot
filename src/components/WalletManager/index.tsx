"use client";

import useLocalStorage from "@/hooks/useLocalstorage";
import React, { useState, FC } from "react";
import { WalletCore } from "@/types/wallet";
import CreateOrRestoreWallet from "./CreateOrRestoreWallet";

const WalletManager: FC = () => {
  const [wallet, setWallet] = useLocalStorage<WalletCore | null>(
    "localWallet",
    null
  );

  const hasWallet = Boolean(wallet);
  return (
    <>
      {hasWallet && (
        <div>
          <p>Wallet Address: {wallet?.taprootAddress}</p>
        </div>
      )}
      {!hasWallet && <CreateOrRestoreWallet />}
    </>
  );
};

export default WalletManager;
