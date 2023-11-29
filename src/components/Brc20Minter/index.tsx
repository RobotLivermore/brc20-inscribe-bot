"use client";

import React from "react";
import Image from "next/image";
import useMint from "./useMint";

const Brc20Minter = () => {
  const { isMinting, onMint } = useMint();

  const [tick, setTick] = React.useState("");
  const [amt, setAmt] = React.useState("");
  const [to, setTo] = React.useState("");
  const handleMint = () => {
    onMint(tick, Number(amt), to);
  };
  return (
    <div className="max-w-xl flex flex-col w-full bg-white p-6 rounded-lg">
      <h2 className="text-xl">BRC20 Minter</h2>
      <div className="flex flex-col mt-2">
        <span className="mb-1">币种（tick）</span>
        <input
          className="border border-slate-300 px-2 py-1 rounded"
          onChange={(e) => {
            setTick(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col mt-2">
        <span className="mb-1">铸造数量（amt）</span>
        <input
          className="border border-slate-300 px-2 py-1 rounded"
          onChange={(e) => {
            setAmt(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col mt-2">
        <span className="mb-1">接收地址（to）</span>
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
  );
};

export default Brc20Minter;
