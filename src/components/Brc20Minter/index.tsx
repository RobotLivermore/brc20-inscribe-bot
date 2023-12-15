"use client";

import React, { useState, useEffect, useCallback } from "react";
import useLocalStorage from "@/hooks/useLocalstorage";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { fetchChainFeeRate } from "@/api/chain";
import Button from "@/ui/Button";
import TransactionConfirm from "../TransactionConfirm";
import { sendBTCByPriv } from "@/utils/transaction";
import { generateAddressFromPubKey } from "@/utils/address";
import useToast from "@/hooks/useToast";
import { inscribeBrc20Mint, fetchTickInfo } from "@/api/mint";
import {
  generateInscribe,
  generatePrivateKey,
  generateBrc20MintContent,
} from "@/utils/mint";
import useNetwork from "@/hooks/useNetwork";
import { v4 as uuidV4 } from "uuid";
import SpeedItem from "./SpeedItem";
import useLoading from "@/hooks/useLoading";
import { ReactSVG } from "react-svg";
import LoadingModal from "@/ui/LoadingModal";
import useWallet from "@/hooks/useWallet";

const Brc20Minter = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [tick, setTick] = React.useState("");
  const [amt, setAmt] = React.useState(0);
  const [to, setTo] = React.useState("");
  const toastError = useToast("error");

  const [network] = useNetwork();
  const [protocol, setProtocol] = useState<"brc-20" | "brc-100">("brc-20");

  const [isConfirmPay, setIsConfirmPay] = useState(false);
  const [isInscribing, setIsInscribing] = useState(false);

  const [feeRate, setFeeRate] = useState<{
    slow: number;
    average: number;
    fast: number;
  }>({ slow: 1, average: 1, fast: 1 });
  const [speed, setSpeed] = useState<"slow" | "average" | "fast">("average");
  const updateFeeRate = useCallback(async () => {
    const feeInfo = await fetchChainFeeRate(network);
    setFeeRate({
      slow: feeInfo.hourFee,
      average: feeInfo.halfHourFee,
      fast: feeInfo.fastestFee,
    });
  }, [network]);

  useEffect(() => {
    updateFeeRate();
  }, [updateFeeRate]);

  const { wallet } = useWallet();

  const [isQueryTick, getIsQueryTick, setIsQueryTick] = useLoading();
  const updateAmount = useCallback(
    async (tick: string) => {
      if (!getIsQueryTick() && protocol === 'brc-20') {
        try {
          setIsQueryTick(true);
          const res = await fetchTickInfo(tick);
          setAmt(Number(res.limit));
        } catch (error) {
          console.log(error);
        } finally {
          setIsQueryTick(false);
        }
      }
    },
    [getIsQueryTick, setIsQueryTick, protocol]
  );

  useEffect(() => {
    if (searchParams.get("tick")) {
      setTick(searchParams.get("tick") as string);
      console.log(searchParams.get("amt"));
      if (searchParams.get("amt")) {
        setAmt(Number(searchParams.get("amt")));
      } else {
        updateAmount(searchParams.get("tick") as string);
      }
    }
    if (searchParams.get('protocol') && ['brc-20', 'brc-100'].includes(searchParams.get('protocol') as string)) {
      setProtocol(searchParams.get('protocol') as 'brc-20' | 'brc-100')
    }
  }, [amt, searchParams, updateAmount]);

  const [orderList, setOrderList] = useLocalStorage<any[]>("orderList", []);

  const addOrderAndJumpToOrderList = (
    _taskId: string,
    _secret: string,
    _content: string,
    _addr: string,
    _receipt: string,
    _fee: number,
    _protocol: string,
  ) => {
    setOrderList([
      {
        taskId: _taskId,
        content: _content,
        secret: _secret,
        inscriptionAddress: _addr,
        receiveAddress: _receipt,
        fee: _fee,
        protocol: _protocol,
        status: "waiting_pay",
        createdAt: new Date().valueOf(),
      },
      ...orderList,
    ]);
  };

  const changeOrderStatus = (taskId: string, status: string) => {
    if (typeof window !== "undefined") {
      try {
        const currentList = JSON.parse(
          window.localStorage.getItem("orderList") as string
        );
        const newList = currentList.map((item: any) => {
          if (item.taskId === taskId) {
            return {
              ...item,
              status,
            };
          }
          return item;
        });
        setOrderList(newList);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleMint = async () => {
    setIsConfirmPay(true);
  };

  const handleTransfer = async (priv: string) => {

    try {
      const secret = generatePrivateKey();
      const _inscriptionAddress = generateInscribe(
        secret,
        tick,
        Number(amt),
        network,
        protocol
      );
      let base = 546;
      if (protocol === "brc-100") {
        base = 294;
      }
      const fee = feeRate[speed] * 154 + base

      setIsInscribing(true);
      const taskId = uuidV4();
      addOrderAndJumpToOrderList(
        taskId,
        secret,
        generateBrc20MintContent(tick, Number(amt), protocol),
        _inscriptionAddress,
        to,
        fee,
        protocol
      );
      const txid = await sendBTCByPriv(
        priv,
        fee,
        feeRate[speed],
        _inscriptionAddress,
        generateAddressFromPubKey(wallet?.publicKey as string, network),
        network
      );
      changeOrderStatus(taskId, "waiting_mint");
      if (protocol === "brc-20") {
        await inscribeBrc20Mint(
          secret,
          generateBrc20MintContent(tick, Number(amt), protocol),
          txid,
          0,
          fee,
          to,
          546,
          network,
        );
        changeOrderStatus(taskId, "minted");
        router.push("/orders");
      } else if (protocol === "brc-100") {
        await inscribeBrc20Mint(
          secret,
          generateBrc20MintContent(tick, Number(amt), protocol),
          txid,
          0,
          fee,
          to,
          294,
          network
        );
        changeOrderStatus(taskId, "minted");
        router.push("/orders");
      }
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
        <div className="max-w-xl flex flex-col w-full bg-white p-4 rounded-3xl border-2 border-black shadow-[5px_5px_black]">
          <h2 className="text-xl font-semibold">Minter</h2>
          <div className="flex flex-col mt-2">
            <span className="mb-1 text-xs">协议（protocol）</span>
            <div className="flex mt-1">
              <Button
                theme={protocol === "brc-20" ? "primary" : "outline"}
                text="BRC-20"
                className="rounded-none px-2 !py-0 text-xs h-5"
                onClick={() => {
                  setProtocol("brc-20");
                }}
              />
              <Button
                theme={protocol === "brc-100" ? "primary" : "outline"}
                text="BRC-100"
                className="ml-2 rounded-none px-2 !py-0 text-xs h-5"
                onClick={() => {
                  setProtocol("brc-100");
                }}
              />
            </div>
            <span className="mt-4 mb-1 text-xs">币种（tick）</span>
            <input
              type="text"
              className="mt-1 input border border-slate-300 bg-transparent px-2 py-1 rounded h-fit focus:border-black !outline-none"
              value={tick}
              onChange={(e) => {
                setTick(e.target.value);
              }}
              onBlur={() => updateAmount(tick)}
            />
          </div>
          <div className="flex flex-col mt-4">
            <span className="mb-1 text-xs flex">
              铸造数量（amt）
              {isQueryTick && (
                <ReactSVG className="ml-1 w-4 h-4" src="/assets/loading2.svg" />
              )}
            </span>
            <input
              type="number"
              value={amt}
              disabled={protocol === 'brc-20'}
              className="mt-1 input border border-slate-300 bg-transparent px-2 py-1 rounded h-fit focus:border-black !outline-none"
              onChange={(e) => {
                setAmt(e.target.value ? Number(e.target.value) : 0);
              }}
            />
          </div>
          <div className="flex flex-col mt-4">
            <span className="mb-1 text-xs">接收地址（to）</span>
            <input
              type="text"
              value={to}
              className="mt-1 input border border-slate-300 bg-transparent px-2 py-1 rounded h-fit focus:border-black !outline-none"
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
        <LoadingModal visible={isInscribing} />
      </div>
    </>
  );
};

export default Brc20Minter;
