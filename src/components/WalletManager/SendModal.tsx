"use client";

import Modal from "@/ui/Modal";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchChainFeeRate } from "@/api/chain";
import { UtxoInfo, WalletCore } from "@/types/wallet";
import { twMerge } from "tailwind-merge";
import Button from "@/ui/Button";
import Image from "next/image";
import { estimateTxFeeByUtxos } from "@/utils/transaction";
import { decrypt } from "@/utils/browser-passworder";
import { getPrivFromMnemonic } from "@/utils/address";
import { sendBTC } from "@/utils/transaction";
import useToast from "@/hooks/useToast";
import { abbreviateText } from "@/utils/formater";

const SpeedItem: React.FC<{
  level: string;
  fee: number;
  active: boolean;
  onClick: () => void;
}> = ({ level, fee, active, onClick }) => {
  const cls = twMerge(
    "flex flex-col items-center justify-between mt-2 rounded py-2 text-sm cursor-pointer",
    !active
      ? "border border-black text-black"
      : "border border-black bg-black text-white"
  );
  return (
    <div className={cls} onClick={onClick}>
      <span>{level}</span>
      <span>{fee} sat/vB</span>
    </div>
  );
};

interface Props {
  visible: boolean;
  balance: number;
  utxos: UtxoInfo[];
  wallet: WalletCore;
  network: "main" | "testnet";
  onClose: () => void;
}

const SendModal: React.FC<Props> = ({
  visible,
  utxos = [],
  wallet,
  network,
  onClose,
}) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<
    "input" | "confirm" | "password" | "success"
  >("input");
  const [receipient, setReceipient] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const [feeRate, setFeeRate] = useState<{
    slow: number;
    average: number;
    fast: number;
  }>({ slow: 1, average: 1, fast: 1 });
  const [isSending, setIsSending] = useState(false);
  const isSendingRef = useRef(false);
  isSendingRef.current = isSending;
  const toastSuccess = useToast("success");
  const toasstError = useToast("error");

  const [fee, setFee] = useState(0);

  const [speed, setSpeed] = useState<"slow" | "average" | "fast">("average");

  const [password, setPassword] = useState("");

  const updateFeeRate = useCallback(async () => {
    const feeInfo = await fetchChainFeeRate("testnet");
    setFeeRate({
      slow: feeInfo.hourFee,
      average: feeInfo.halfHourFee,
      fast: feeInfo.fastestFee,
    });
  }, []);

  const handleCalculateFee = useCallback(async () => {
    if (amount === undefined) {
      return 0;
    }
    const selectableUtxos = utxos.filter((utxo) => {
      return utxo.value > 800;
    });
    const fee = await estimateTxFeeByUtxos(
      selectableUtxos,
      amount,
      feeRate[speed]
    );
    setFee(fee);
  }, [amount, feeRate, speed, utxos]);

  useEffect(() => {
    if (visible) {
      updateFeeRate();
    }
  }, [visible, updateFeeRate]);

  const availableBalance = utxos.reduce((acc, cur) => {
    console.log(cur);
    if (cur.value > 800) {
      return acc + cur.value;
    }
    return acc;
  }, 0);

  const confirmSend = async () => {
    try {
      if (isSendingRef.current) {
        return;
      }
      isSendingRef.current = true;
      setIsSending(true);
      const decryptedWallet = await decrypt(password, wallet?.encryptedSeed);
      const priv = getPrivFromMnemonic(decryptedWallet as string);
      const availableUtxos = utxos.filter((utxo) => {
        return utxo.value > 800;
      });
      const result = await sendBTC(
        priv,
        availableUtxos,
        Math.floor((amount as number) * 100000000),
        feeRate[speed],
        receipient,
        wallet?.taprootAddress,
        network
      );
      toastSuccess(t("wallet.sendSuccess"));
    } catch (error) {
      console.log(error);
      toasstError(t("wallet.sendFailed"));
    } finally {
      setIsSending(false);
      isSendingRef.current = false;
    }
  };

  return (
    <Modal visible={visible} onClose={() => {
      onClose();
      setStage("input");
      setReceipient("");
      setAmount(undefined);
      setSpeed("average");
      setFee(0);
      setPassword("");
    }}>
      <div className="flex flex-col items-center py-6 bg-white w-[100vw] max-w-sm rounded-lg px-4">
        {stage === "input" && (
          <>
            <input
              type="text"
              placeholder={t("wallet.receipientAddress")}
              className="input mt-4 text-black input-bordered rounded-full bg-white w-full"
              value={receipient}
              onChange={(e) => {
                setReceipient(e.target.value);
              }}
            />
            <div className="flex items-center mt-2">
              <span>{t("wallet.available")}</span>
              <span className="ml-2">{availableBalance / 100000000} </span>
            </div>
            <input
              type="number"
              placeholder={t("wallet.amount")}
              className="input mt-4 text-black input-bordered rounded-full bg-white w-full"
              value={amount}
              onChange={(e) => {
                if (e.target.value === "") {
                  setAmount(undefined);
                  return;
                }
                setAmount(Number(e.target.value));
              }}
            />
            <div className="flex flex-col items-start w-full mt-4">
              <span>{t("wallet.fee")}</span>
              <div className="grid grid-cols-3 gap-6 w-full">
                <SpeedItem
                  level={t("wallet.slow")}
                  fee={feeRate.slow}
                  active={speed === "slow"}
                  onClick={() => {
                    setSpeed("slow");
                  }}
                />
                <SpeedItem
                  level={t("wallet.average")}
                  fee={feeRate.average}
                  active={speed === "average"}
                  onClick={() => {
                    setSpeed("average");
                  }}
                />
                <SpeedItem
                  level={t("wallet.fast")}
                  fee={feeRate.fast}
                  active={speed === "fast"}
                  onClick={() => {
                    setSpeed("fast");
                  }}
                />
              </div>
            </div>
            <Button
              theme="primary"
              disabled={amount === undefined || amount === 0 || !receipient}
              text={t("wallet.next")}
              className="mt-4 w-full"
              onClick={() => {
                setStage("confirm");
                handleCalculateFee();
              }}
            />
          </>
        )}
        {stage === "confirm" && (
          <>
            <div className="flex flex-col items-center w-full">
              <h3 className="text-xl font-semibold relative w-full">
                <span
                  className="absolute w-7 h-7 left-0 top-0 flex justify-center items-center rounded active:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setStage("input");
                  }}
                >
                  <Image
                    src="/assets/icon/outline/back.svg"
                    alt="back"
                    width={16}
                    height={16}
                  />
                </span>
                {t("wallet.signTransaction")}
              </h3>
              <div className="flex flex-col w-full pt-8">
                <span className="text-left font-semibold">
                  {t("wallet.receipientAddress")}:
                </span>
                <span className="text-left mt-2 ">
                  {abbreviateText(receipient, 10, 10)}
                </span>
                <span className="text-left mt-4 font-semibold">
                  {t("wallet.spendAmount")}:
                </span>
                <span className="text-left mt-2">
                  {((amount || 0) * 100000000 + fee) / 100000000} BTC
                </span>
              </div>
            </div>
            <Button
              theme="primary"
              text={t("common.confirm")}
              className="mt-6 w-full"
              onClick={() => {
                setStage("password");
              }}
            />
          </>
        )}
        {stage === "password" && (
          <>
            <div className="flex flex-col items-center w-full">
              <h3 className="text-xl font-semibold relative w-full">
              <span
                  className="absolute w-7 h-7 left-0 top-0 flex justify-center items-center rounded active:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setStage("confirm");
                  }}
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
              text={t("wallet.send")}
              className="mt-8 w-full"
              onClick={() => {
                // setStage("success");
                confirmSend();
              }}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default SendModal;
