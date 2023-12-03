"use client";

import useLocalStorage from "@/hooks/useLocalstorage";
import React, { FC } from "react";
import { WalletCore } from "@/types/wallet";
import CreateOrRestoreWallet from "./CreateOrRestoreWallet";
import WalletOperator from "./WalletOperator";

const WalletManager: FC = () => {
  const [wallet, setWallet] = useLocalStorage<WalletCore | null>(
    "localWallet",
    null
  );

  const hasWallet = Boolean(wallet);
  return (
    <>
      {hasWallet && <WalletOperator wallet={wallet as WalletCore} />}
      {!hasWallet && (
        <CreateOrRestoreWallet
          onFinishCreateWallet={(w) => {
            setWallet(w);
          }}
        />
      )}
    </>
  );
};

export default WalletManager;
