"use client";

import { WalletCore } from "@/types/wallet";
import { FC, useState, useEffect, useCallback } from "react";
import { generateAddressFromPubKey } from "@/utils/address";
import { abbreviateText } from "@/utils/formater";
import Button from "@/ui/Button";
import copy from "copy-text-to-clipboard";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";
import useToast from "@/hooks/useToast";
import ReceiveModal from "./ReceiveModal";

interface Props {
  wallet: WalletCore;
}

const WalletOperator: FC<Props> = ({ wallet }) => {
  const { t } = useTranslation();

  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (wallet.publicKey) {
      const _addr = generateAddressFromPubKey(wallet.publicKey);
      setAddress(_addr);
    }
  }, [wallet.publicKey]);

  const toast = useToast();

  const [isOpenReceiveModal, setIsOpenReceiveModal] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsOpenReceiveModal(false);
  }, []);
  return (
    <div className="flex flex-col w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl border border-black">
      <div className="border-b border-black w-full flex justify-center items-center h-16 relative">
        <span
          className="py-1 px-2 rounded-md cursor-pointer active:bg-gray-100"
          onClick={() => {
            copy(address);
            toast(t("wallet.copiedToClipboard"));
          }}
        >
          {abbreviateText(address, 4)}
        </span>
      </div>
      <div className="flex flex-col items-center p-4 pt-6 pb-8">
        <span className="text-sm">{t("wallet.homeTitle")}</span>
        <span className="mt-8 text-2xl font-bold">0.00 BTC</span>
        <div className="grid grid-cols-2 gap-4 mt-10 w-full">
          <Button theme="outline" text={t("wallet.send")} className="" />
          <Button
            theme="outline"
            text={t("wallet.receive")}
            className=""
            onClick={() => {
              setIsOpenReceiveModal(true);
            }}
          />
        </div>
      </div>
      <Toaster />
      <ReceiveModal
        address={address}
        visible={isOpenReceiveModal}
        onClose={handleClose}
      />
    </div>
  );
};

export default WalletOperator;
