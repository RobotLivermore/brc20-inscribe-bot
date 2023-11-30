"use client";

import React, { useState } from "react";
import Image from "next/image";
import useLocalStorage from "@/hooks/useLocalstorage";
import useMint from "./useMint";
import TaskDisplay from "../OrderList/TaskDisplay";
import { useRouter } from "next/navigation";

const Brc20Minter = () => {
  const router = useRouter();
  const { isMinting, onMint } = useMint();

  const [tick, setTick] = React.useState("");
  const [amt, setAmt] = React.useState("");
  const [to, setTo] = React.useState("");
  const [taskID, setTaskID] = React.useState("");
  const [inscriptionAddress, setInscriptionAddress] = useState("");
  const [fee, setFee] = useState(0);

  const [orderList, setOrderList] = useLocalStorage<any[]>("orderList", []);

  const addOrderAndJumpToOrderList = (_taskId: string, _addr: string, _fee: number) => {
    setOrderList([
      {
        taskId: _taskId,
        inscriptionAddress: _addr,
        fee: _fee,
      },
      ...orderList,
    ]);
    router.push("/orders");
  };

  const handleMint = async () => {
    const reslut = await onMint(tick, Number(amt), to);
    if (reslut?.taskId) {
      addOrderAndJumpToOrderList(reslut?.taskId, reslut?.inscriptionAddress, reslut?.fee);
    }
  };
  return (
    <div className="flex flex-col w-full items-center'/.">
      <div className="max-w-xl flex flex-col w-full bg-white p-4 rounded-3xl">
        <h2 className="text-xl">BRC20 Minter</h2>
        <div className="flex flex-col mt-2">
          <span className="mb-1 text-xs">币种（tick）</span>
          <input
            className="border border-slate-300 px-2 py-1 rounded"
            onChange={(e) => {
              setTick(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col mt-2">
          <span className="mb-1 text-xs">铸造数量（amt）</span>
          <input
            className="border border-slate-300 px-2 py-1 rounded"
            onChange={(e) => {
              setAmt(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col mt-2">
          <span className="mb-1 text-xs">接收地址（to）</span>
          <input
            className="border border-slate-300 px-2 py-1 rounded"
            onChange={(e) => {
              setTo(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col py-3 ">
          <button
            className="bg-black py-1.5 text-white rounded flex justify-center items-center"
            onClick={handleMint}
          >
            {isMinting && (
              <Image src="/loading.svg" width={20} height={20} alt="loading" />
            )}
            确认
          </button>
        </div>
      </div>

    </div>
  );
};

export default Brc20Minter;
