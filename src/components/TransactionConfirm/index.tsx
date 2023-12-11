import Modal from "@/ui/Modal";
import React, { FC } from "react";
import Image from "next/image";
import Button from "@/ui/Button";
import { useTranslation } from "react-i18next";
import useWallet from "@/hooks/useWallet";
import toast from "react-hot-toast";
import { getPrivFromMnemonic } from "@/utils/address";
import { decrypt } from "@/utils/browser-passworder";

interface TransactionConfirmProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (priv: string) => void;
}

const TransactionConfirm: FC<TransactionConfirmProps> = ({
  visible,
  onConfirm,
  onClose,
}) => {
  const [password, setPassword] = React.useState<string>("");
  const { t } = useTranslation();
  const { wallet } = useWallet();

  // const [errorTips, setErrorTips] = React.useState<string>("");

  const confirmSend = async () => {
    if (!wallet) {
      return;
    }
    try {
      const memonic = (await decrypt(password, wallet.encryptedSeed)) as string;
      const priv = getPrivFromMnemonic(memonic);
      if (!memonic) {
        toast.error(t("wallet.passwordError"));
        return;
      }
      onConfirm(priv);
      onClose();
    } catch (e) {
      console.log(t("wallet.passwordError"));
      toast.error(t("wallet.passwordError"));
    }
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="flex flex-col py-6 bg-white w-[100vw] max-w-sm rounded-lg px-4">
        <div className="flex flex-col items-center w-full">
          <h3 className="text-xl font-semibold relative w-full">
            <span
              className="absolute w-7 h-7 left-0 top-0 flex justify-center items-center rounded active:bg-gray-200 cursor-pointer"
              onClick={onClose}
            >
              <Image
                src="/assets/icon/outline/back.svg"
                alt="back"
                width={16}
                height={16}
              />
            </span>
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
          text={t("common.confirm")}
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

export default TransactionConfirm;
