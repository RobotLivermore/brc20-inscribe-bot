"use client";

import Modal from "@/ui/Modal";
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import { abbreviateText } from "@/utils/formater";
import Button from "@/ui/Button";
import useCopy from "@/hooks/useCopy";

interface Props {
  visible: boolean;
  onClose: () => void;
  address: string;
}

const ReceiveModal: React.FC<Props> = ({ visible, address, onClose }) => {
  const { t } = useTranslation();
  const copy = useCopy();
  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="flex flex-col items-center py-6 bg-white w-[100vw] max-w-sm rounded-lg px-4">
        <span className="bg-[#caff04] w-fit flex justify-center items-center p-3 rounded-full border-4 border-black">
          <Image
            src="/assets/icon/outline/qrcode.svg"
            alt="receive"
            width={36}
            height={36}
          />
        </span>
        <h3 className="text-2xl font-semibold mt-3">{t("wallet.receive")}</h3>
        <p className="mt-2 text-sm">{t("wallet.receiveTips")}</p>
        <div className="mt-3 p-2 flex justify-center items-center rounded-md">
          <QRCodeCanvas value={address} size={200} />
        </div>
        <div
          className="px-2 py-1 bg-gray-100 rounded-lg cursor-pointer"
          onClick={() => {
            copy(address);
          }}
        >
          {abbreviateText(address, 8, 8)}
        </div>

        <Button
          theme="outline"
          text={t("common.cancel")}
          onClick={onClose}
          className="mt-4 w-full"
        />
      </div>
    </Modal>
  );
};

export default ReceiveModal;
