"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { WalletCore } from "@/types/wallet";
import SelectSource from "./SelectSource";
import SetPassword from "./SetPassword";
import ConfirmMnemonic from "./ConfirmMnemonic";
import Mnemonic from "./Mnemonic";
import RestoreMnemonic from "./RestoreMnemonic";
import { encrypt } from '@/utils/browser-passworder'

interface Props {
  onFinishCreateWallet: (w: WalletCore) => void;
}

const CreateOrRestoreWallet: FC<Props> = ({ onFinishCreateWallet }) => {
  /**
   * page value init, setPassword, mnemonic, confirmMnemonic, inputMnemonic, restoreWallet
   */
  const [page, setPage] = useState("init");
  const [source, setSource] = useState("create"); // create || restore

  const [tempMnemonic, setTempMnemonic] = useState("");
  const [password, setPassword] = useState("");

  const saveTempMnemonic = useCallback((tm: string) => {
    localStorage.setItem(
      "tempMnemonic",
      JSON.stringify({ tempMnemonic: tm, createdAt: Date.now() })
    );
  }, []);

  const handleChangeTempMnemonic = useCallback((tm: string) => {
    setTempMnemonic(tm);
    saveTempMnemonic(tm);
  }, [saveTempMnemonic]);

  const onCreateNewWallet = useCallback(() => {
    setSource("create");
    setPage("setPassword");
  }, []);

  const onRestoreWallet = useCallback(() => {
    setSource("restore");
    setPage("setPassword");
  }, []);

  const onCreatPasswordBack = useCallback(() => {
    setPage("init");
  }, []);

  const onCreatePasswordNext = useCallback(
    (psw: string) => {
      setPassword(psw);
      if (source === "create") {
        setPage("mnemonic");
      } else {
        setPage("inputMnemonic");
      }
    },
    [source]
  );

  const onConfirmMnemonic = async () => {
    const payload = await encrypt(password, tempMnemonic)

    const newWallet = {
      encryptedSeed: payload,
      taprootAddress: "111",
      publicKey: "11",
    } as WalletCore;
    onFinishCreateWallet(newWallet);
  };

  const onConfirmRestoreMnemonic = async (mnemonic: string) => {
    const payload = await encrypt(password, mnemonic)

    const newWallet = {
      encryptedSeed: payload,
      taprootAddress: "111",
      publicKey: "11",
    } as WalletCore;
    onFinishCreateWallet(newWallet);
  }

  if (page === "init") {
    return (
      <SelectSource
        onCreateNewWallet={onCreateNewWallet}
        onRestoreWallet={onRestoreWallet}
      />
    );
  } else if (page === "setPassword") {
    return (
      <SetPassword onBack={onCreatPasswordBack} onNext={onCreatePasswordNext} />
    );
  } else if (page === "mnemonic") {
    return (
      <Mnemonic
        onConfirm={(m) => {
          handleChangeTempMnemonic(m);
          setPage("confirmMnemonic");
        }}
      />
    );
  } else if (page === "confirmMnemonic") {
    return (
      <ConfirmMnemonic
        mnemonic={tempMnemonic}
        onConfirm={onConfirmMnemonic}
        onBack={() => {
          setPage("mnemonic");
        }}
      />
    );
  } else if (page === "inputMnemonic") {
    return (
      <RestoreMnemonic
        onConfirm={(m) => {
          onConfirmRestoreMnemonic(m);
        }}
      />
    );
  }
  return null;
};

export default CreateOrRestoreWallet;
