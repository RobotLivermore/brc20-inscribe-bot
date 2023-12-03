"use client";

import { WalletCore } from "@/types/wallet";
import { FC, useState } from "react";
import { decrypt } from '@/utils/browser-passworder'

interface Props {
  wallet: WalletCore;
}

const WalletOperator: FC<Props> = ({ wallet }) => {
  console.log(wallet)
  const [password, setPassword] = useState<string>("");

  const decryptWallet = async () => {
    try {
      const decryptedWallet = await decrypt(password, wallet.encryptedSeed);
      console.log(decryptedWallet);
    } catch (error) {
      
      console.log(error);
    }
  }


  return (
    <div className="flex flex-col w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl border border-black">
      <div className="border-b w-full flex items-center h-8">bc1p....dyh6</div>
      <div className="flex flex-col p-4">
        <input
          className="input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button className="btn" onClick={decryptWallet}>Decode</button>
      </div>
    </div>
  );
};

export default WalletOperator;
