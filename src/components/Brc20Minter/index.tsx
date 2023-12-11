"use client";

import React, { useState, useEffect, useCallback } from "react";
// import Image from "next/image";
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
import { createOrder, inscribeBrc20Mint } from "@/api/mint";
import {
  generateInscribe,
  generatePrivateKey,
  generateBrc20MintContent,
} from "@/utils/mint";
import Modal from "@/ui/Modal";

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

  const [secret, setSecret] = React.useState("");
  const [tick, setTick] = React.useState("");
  const [amt, setAmt] = React.useState("");
  const [to, setTo] = React.useState("");
  const toastError = useToast("error");

  const [isConfirmPay, setIsConfirmPay] = useState(false);
  const [isInscribing, setIsInscribing] = useState(false);

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
  };

  const changeOrderStatus = (taskId: string, status: string) => {
    const newList = orderList.map((item) => {
      if (item.taskId === taskId) {
        return {
          ...item,
          status,
        };
      }
      return item;
    });
    setOrderList(newList);
  }

  const handleMint = async () => {
    // const reslut = await onMint(tick, Number(amt), to);
    const st = generatePrivateKey();
    setSecret(st);
    console.log(st);
    const reslut = generateInscribe(st, tick, Number(amt));
    console.log(tick, Number(amt), reslut);
    setInscriptionAddress(reslut);
    setFee(feeRate[speed] * 230);
    setIsConfirmPay(true);
  };

  const handleTransfer = async (priv: string) => {
    console.log("spend amount", Number(fee));
    setIsInscribing(true);
    try {
      const newTask = await createOrder(secret, tick, Number(amt), to);
      console.log("inscriptionAddress", inscriptionAddress);
      console.log(newTask);
      addOrderAndJumpToOrderList(newTask.taskId, inscriptionAddress, fee);
      const txid = await sendBTCByPriv(
        priv,
        fee + 546,
        feeRate[speed],
        inscriptionAddress,
        generateAddressFromPubKey(wallet?.publicKey as string, "testnet"),
        "testnet"
      );
      await inscribeBrc20Mint(
        secret,
        generateBrc20MintContent(tick, Number(amt)),
        txid,
        0,
        fee + 546,
        to
      );
      router.push("/orders");
    } catch (error: any) {
      console.log(error);
      toastError(error.message);
    } finally {
      setIsInscribing(false);
    }
  };
  return (
    <>
      <div className="flex flex-col w-full items-center text-black">
        <div className="max-w-xl flex flex-col w-full bg-white p-4 rounded-3xl">
          <h3 className="text-xl font-semibold">Hot Token</h3>
          <table className="mt-4">
            <thead>
              <tr className="text-left">
                <th>Tick</th>
                <th>Max Amount</th>
                <th>Holders</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className=" font-light">
                <td>mice</td>
                <td>1000</td>
                <td>10</td>
                <td>
                  <Button
                    theme="outline"
                    className="p-1 px-3"
                    text="Mint"
                    onClick={() => {
                      setTick("mice");
                      setAmt("1000");
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 max-w-xl flex flex-col w-full bg-white p-4 rounded-3xl">
          <h2 className="text-xl font-semibold">BRC20 Minter</h2>
          <div className="flex flex-col mt-2">
            <span className="mb-1 text-xs">币种（tick）</span>
            <input
              type="text"
              className="border border-slate-300 bg-transparent px-2 py-1 rounded"
              value={tick}
              onChange={(e) => {
                setTick(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col mt-2">
            <span className="mb-1 text-xs">铸造数量（amt）</span>
            <input
              type="number"
              value={amt}
              className="border border-slate-300 bg-transparent px-2 py-1 rounded"
              onChange={(e) => {
                setAmt(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col mt-2">
            <span className="mb-1 text-xs">接收地址（to）</span>
            <input
              type="text"
              value={to}
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
        <Modal visible={isInscribing} onClose={() => {}}>
          <div className="flex justify-center items-center p-6 bg-white rounded-lg">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Brc20Minter;
