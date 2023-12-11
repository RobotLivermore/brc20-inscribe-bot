"use client";

import React, { FC } from "react";
import { WalletCore } from "@/types/wallet";
import CreateOrRestoreWallet from "./CreateOrRestoreWallet";
import WalletOperator from "./WalletOperator";
import useWallet from "@/hooks/useWallet";

const WalletManager: FC = () => {
  const { wallet, saveWallet, clearWallet } = useWallet();

  const hasWallet = Boolean(wallet);
  return (
    <>
      {hasWallet && (
        <WalletOperator
          wallet={wallet as WalletCore}
          onDeleteWallet={clearWallet}
        />
      )}
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
