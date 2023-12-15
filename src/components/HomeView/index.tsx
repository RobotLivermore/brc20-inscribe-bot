'use client'

import { FC, useState } from "react";
import Button from "@/ui/Button";
import MintButton from "./MintButton";

interface Props {
  ticks: any[];
}
const HomeView: FC<Props> = ({ ticks }) => {
  console.log(ticks);
  

  return (
    <>
      <div className="flex flex-col w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl border border-black shadow-[5px_5px_black]">
        <h3 className="font-bold text-xl py-2 px-3 border-b border-black">
          Hot Mints
        </h3>
        <div className="px-2 py-4">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="font-medium">
                <th>Tick</th>
                <th>Holders</th>
                <th>Process</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {ticks.map((tick) => (
                <tr key={tick.tick} className="border-b border-gray-100">
                  <td>{tick.tick}</td>
                  <td>{tick.holders}</td>
                  <td>{(Number(tick.mint_progress) * 100).toFixed(2)}%</td>
                  <td className="py-1"><MintButton tick={tick.tick} limit={tick.limit} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HomeView;
