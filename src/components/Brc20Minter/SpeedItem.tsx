import React from "react";
import { twMerge } from "tailwind-merge";

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

export default SpeedItem;
