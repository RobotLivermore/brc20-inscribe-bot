"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useLocalStorage from "@/hooks/useLocalstorage";
import useMint from "./useMint";
import { useRouter } from "next/navigation";
import { WalletCore } from "@/types/wallet";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { fetchChainFeeRate } from "@/api/chain";
import Button from "@/ui/Button";
import TransactionConfirm from "../TransactionConfirm";
import { sendBTCByPriv } from "@/utils/transaction";
import { generateAddressFromPubKey } from "@/utils/address";
import useToast from "@/hooks/useToast";
import { inscribeBrc20Mint } from "@/api/mint";
import { generateInscribe, generatePrivateKey, generateBrc20MintContent } from "@/utils/mint";

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

const Brc20Minter = () => {
  const router = useRouter();
  const { isMinting, onMint } = useMint();
  const { t } = useTranslation();

  const [screct, setScrect] = React.useState("");
  const [tick, setTick] = React.useState("");
  const [amt, setAmt] = React.useState("");
  const [to, setTo] = React.useState("");
  const toastError = useToast("error");

  const [isConfirmPay, setIsConfirmPay] = useState(false);

  const [feeRate, setFeeRate] = useState<{
    slow: number;
    average: number;
    fast: number;
  }>({ slow: 1, average: 1, fast: 1 });
  const [speed, setSpeed] = useState<"slow" | "average" | "fast">("average");
  const updateFeeRate = useCallback(async () => {
    const feeInfo = await fetchChainFeeRate("testnet");
    setFeeRate({
      slow: feeInfo.hourFee,
      average: feeInfo.halfHourFee,
      fast: feeInfo.fastestFee,
    });
  }, []);

  useEffect(() => {
    updateFeeRate();
  }, [updateFeeRate]);

  const [wallet, setWallet] = useState<WalletCore | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const item = window.localStorage.getItem("localWallet");
      if (item) {
        setWallet(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return;
    }
  }, []);

  const [taskID, setTaskID] = React.useState("");
  const [inscriptionAddress, setInscriptionAddress] = useState("");
  const [fee, setFee] = useState(0);

  const [orderList, setOrderList] = useLocalStorage<any[]>("orderList", []);

  const addOrderAndJumpToOrderList = (
    _taskId: string,
    _addr: string,
    _fee: number
  ) => {
    setOrderList([
      {
        taskId: _taskId,
        inscriptionAddress: _addr,
        fee: _fee,
      },
      ...orderList,
    ]);
    // router.push("/orders");
  };

  const handleMint = async () => {
    // const reslut = await onMint(tick, Number(amt), to);
    const secret = generatePrivateKey();
    setScrect(secret);
    const reslut = generateInscribe(secret, tick, Number(amt));
    setInscriptionAddress(reslut);
    setFee(feeRate[speed] * 230);
    setIsConfirmPay(true);
  };

  const handleTransfer = async (priv: string) => {
    console.log("spend amount", Number(fee));
    try {
      const txid = await sendBTCByPriv(
        priv,
        fee + 546,
        feeRate[speed],
        inscriptionAddress,
        generateAddressFromPubKey(wallet?.publicKey as string, "testnet"),
        "testnet"
      );
      const resp = await inscribeBrc20Mint(screct, generateBrc20MintContent(tick, Number(amt)), txid, 0, fee + 546, to)
      console.log(resp);
    } catch (error: any) {
      console.log(error);
      toastError(error.message);
    }
  };
  return (
    <div className="flex flex-col w-full items-center text-black">
      <div className="max-w-xl flex flex-col w-full bg-white p-4 rounded-3xl">
        <h2 className="text-xl">BRC20 Minter</h2>
        <div className="flex flex-col mt-2">
          <span className="mb-1 text-xs">币种（tick）</span>
          <input
            className="border border-slate-300 bg-transparent px-2 py-1 rounded"
            onChange={(e) => {
              setTick(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col mt-2">
          <span className="mb-1 text-xs">铸造数量（amt）</span>
          <input
            className="border border-slate-300 bg-transparent px-2 py-1 rounded"
            onChange={(e) => {
              setAmt(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col mt-2">
          <span className="mb-1 text-xs">接收地址（to）</span>
          <input
            className="border border-slate-300 bg-transparent px-2 py-1 rounded"
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-6 w-full">
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
        <div className="flex flex-col pt-8 ">
          <Button
            disabled={isMinting}
            theme="primary"
            text={t("inscribe.mint")}
            onClick={handleMint}
          />
        </div>
      </div>
      <TransactionConfirm
        visible={isConfirmPay}
        onConfirm={handleTransfer}
        onClose={() => setIsConfirmPay(false)}
      />
    </div>
  );
};

export default Brc20Minter;
