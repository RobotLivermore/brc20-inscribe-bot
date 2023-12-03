"use client";

import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from "bip39";

interface Props {
  onConfirm: (mnemonic: string) => void;
}

const RestoreMnemonic: FC<Props> = ({ onConfirm }) => {
  const { t } = useTranslation();
  const [mnemonic, setMnemonic] = React.useState<string>("");

  const isMnemonicValid = validateMnemonic(mnemonic);
  return (
    <div className="flex flex-col pb-8 pt-4 px-4 w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl text-black">
      <h3 className="font-bold text-xl">{t("wallet.secretRecoveryphrase")}</h3>
      <p className="text-sm text-gray-400 mt-4">{t("wallet.mnemonicTips")}</p>
      <textarea
        className="outline-none mt-4 w-full h-32 bg-transparent border rounded-xl px-4 py-2 resize-none focus:border-black"
        value={mnemonic}
        onChange={(e) => {
          setMnemonic(e.target.value);
        }}
        placeholder="Enter your mnemonic"
      />
      <button
        className="btn bg-black rounded-full text-white py-2 px-4 mt-4 overflow-hidden disabled:text-gray-100"
        onClick={() => {
          onConfirm(mnemonic);
        }}
        disabled={!isMnemonicValid}
      >
        {t("wallet.next")}
      </button>
    </div>
  );
};

export default RestoreMnemonic;
