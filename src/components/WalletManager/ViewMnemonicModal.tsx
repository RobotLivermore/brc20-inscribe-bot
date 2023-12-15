import Modal from "@/ui/Modal";
import React, { FC, useCallback } from "react";
import Image from "next/image";
import Button from "@/ui/Button";
import { useTranslation } from "react-i18next";
import useWallet from "@/hooks/useWallet";
import toast from "react-hot-toast";
import { getPrivFromMnemonic } from "@/utils/address";
import { decrypt } from "@/utils/browser-passworder";

interface ViewMnemonicModalProps {
  visible: boolean;
  onClose: () => void;
}

const ViewMnemonicModal: FC<ViewMnemonicModalProps> = ({
  visible,
  onClose,
}) => {
  const [password, setPassword] = React.useState<string>("");
  const { t } = useTranslation();
  const { wallet } = useWallet();
  const [mnemonic, setMnemonic] = React.useState<string>("");

  // const [errorTips, setErrorTips] = React.useState<string>("");

  const confirmSend = async () => {
    if (!wallet) {
      return;
    }
    try {
      const _m = (await decrypt(password, wallet.encryptedSeed)) as string;
      setMnemonic(_m);
      if (!_m) {
        toast.error(t("wallet.passwordError"));
        return;
      }
    } catch (e) {
      console.log(t("wallet.passwordError"));
      toast.error(t("wallet.passwordError"));
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    setPassword("");
    setMnemonic("");
  }, [onClose]);

  return (
    <Modal visible={visible} onClose={handleClose}>
      <div className="flex flex-col py-6 bg-white w-[100vw] max-w-sm rounded-lg px-4">
        <h3 className="text-xl font-semibold relative w-full mb-4">
          {t("wallet.viewMnemonic")}
        </h3>
        {!mnemonic && (
          <div className="flex flex-col items-center w-full">
            <input
              type="password"
              placeholder={t("wallet.password")}
              className="input mt-8 text-black input-bordered rounded-full bg-white w-full"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
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
        )}
        {mnemonic && (
          <div>
            <div className="px-4 py-6 rounded-xl border border-blackZ">
              {mnemonic}
            </div>
            <p className="text-sm mt-2">{`Derivation path: m/86'/0'/0'/0/0`}</p>
            <Button
              theme="primary"
              text={t("wallet.copyToClipboard")}
              className="mt-6 w-full"
            />
            <Button
              theme="outline"
              text={t("wallet.back")}
              className="mt-4 w-full"
              onClick={handleClose}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewMnemonicModal;
