"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generateMnemonic } from "bip39";
import toast, { Toaster } from 'react-hot-toast';
import useThrottleFn from "@/hooks/useThrottleFn";
import useCopy from "@/hooks/useCopy";

const MnemonicDisplay: React.FC<{ mnemonic: string }> = ({ mnemonic }) => {
  const wordList = mnemonic.split(" ");
  return (
    <div className="grid grid-cols-2 gap-5 mt-4">
      {wordList.map((word, index) => (
        <div className="flex" key={index}>
          <span className="flex justify-center items-center w-8 h-8 bg-black text-white rounded">
            {index + 1}
          </span>
          <span
            key={index}
            className="ml-2 px-2 flex-grow border h-8 flex items-center rounded"
          >
            {word}
          </span>
        </div>
      ))}
    </div>
  );
};

interface Props {
  onConfirm: (mnemonic: string) => void;
}

const Mnemonic: React.FC<Props> = ({ onConfirm }) => {
  const [mnemonic, setMnemonic] = React.useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    const m = generateMnemonic();
    setMnemonic(m);
  }, []);

  const copy = useCopy();


  const handleConfirmMnemonic = () => {
    onConfirm(mnemonic);
  };

  return (
    <div className="flex flex-col pb-8 pt-4 px-4 w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl text-black">
      <h3 className="font-bold text-xl">{t("wallet.secretRecoveryphrase")}</h3>
      <p className="text-sm text-gray-400 mt-4">{t("wallet.mnemonicTips")}</p>
      <span className="mt-2 test-sm font-semibold text-red-700">
        {t("wallet.mnemonicTips2")}
      </span>
      {/* <div className="mt-4 w-full h-32 bg-transparent border rounded-xl p-4">
        {mnemonic}
      </div> */}
      <MnemonicDisplay mnemonic={mnemonic} />
      <button
        className="btn btn-outline border-black rounded-full text-black flex justify-center mt-4 text-sm"
        onClick={() => {
          copy(mnemonic);
        }}
      >
        {t("wallet.copyToClipboard")}
      </button>

      <button
        className="btn bg-black rounded-full text-white py-2 px-4 mt-4 overflow-hidden"
        onClick={handleConfirmMnemonic}
      >
        {t("wallet.next")}
      </button>
      <Toaster />
    </div>
  );
};

export default Mnemonic;
