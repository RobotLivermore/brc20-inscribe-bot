"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { WalletCore } from "@/types/wallet";
import Modal from "@/ui/Modal";
import { useTranslation } from "react-i18next";
import Button from "@/ui/Button";
import { getPrivFromMnemonic } from "@/utils/address";
import { decrypt } from "@/utils/browser-passworder";
import { sendBTC } from "@/utils/transaction";

interface Props {
  visible: boolean;
  toAddress: string;
  wallet: WalletCore;
  onClose: () => void;
}

const SendModal: React.FC<Props> = ({ visible, toAddress, wallet, onClose }) => {
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const confirmSend = useCallback(async () => {
    if (!wallet?.encryptedSeed) {
      return;
    }
    const decrypted = await decrypt(password, wallet?.encryptedSeed);
    const priv = getPrivFromMnemonic(decrypted as string);
    
  }, [password, wallet]);
  return (
    <Modal visible={visible} onClose={() => {
      onClose();
      setPassword("");
    }}>
      <div className="flex flex-col items-center py-6 bg-white w-[100vw] max-w-sm rounded-lg px-4">
        <div className="flex flex-col items-center w-full">
          <h3 className="text-xl font-semibold relative w-full">
            {t("wallet.password")}
          </h3>
          <input
            type="password"
            placeholder={t("wallet.password")}
            className="input mt-8 text-black input-bordered rounded-full bg-white w-full"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <Button
          disabled={!password}
          theme="primary"
          text={t("wallet.send")}
          className="mt-8 w-full"
          onClick={() => {
            // setStage("success");
            confirmSend();
          }}
        />
      </div>
    </Modal>
  );
};

export default SendModal;
