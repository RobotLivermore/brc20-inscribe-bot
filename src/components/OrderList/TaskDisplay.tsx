"use client";

import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
import copy from "copy-text-to-clipboard";
import { displaySixCharactersAround } from "../Brc20Minter/utils";

const formatStatus = (status: string) => {
  if (status === "waiting_pay") {
    return "待支付";
  } else if (status === "waiting_mint") {
    return "待支付";
  } else if (status === "minted") {
    return "铭刻成功";
  } else if (status === "failed") {
    return "超时失败";
  } else if (status === "waiting_refund") {
    return "等待退款";
  } else if (status === "refunded") {
    return "已退款";
  } else {
    return status;
  }
};

interface Props {
  taskId: string;
  inscriptionAddress: string;
  fee: number;
  status: string;
  onOpenWallet: (address: string, satsAmount: number) => void;
}

const TaskDisplay: React.FC<Props> = ({
  taskId,
  inscriptionAddress,
  fee,
  status,
  onOpenWallet,
}) => {
  return (
    <div className="flex flex-col justify-center bg-white my-2 py-4 rounded-lg">
      <div className="flex px-4 justify-between">
        <span>Order ID:</span>
        <span className="flex">
          <span>{displaySixCharactersAround(taskId)}</span>
          <Image
            src="/assets/icon/outline/copy.svg"
            className="mx-1"
            width={16}
            height={16}
            alt="copy"
            onClick={() => {
              copy(taskId);
            }}
          />
        </span>
      </div>
      <div className="flex justify-between mt-2 px-4">
        <span
          className="flex flex-col"
          onClick={() => {
            copy(inscriptionAddress);
          }}
        >
          <QRCodeCanvas value={inscriptionAddress} />
          <span className="flex justify-center">
            {displaySixCharactersAround(inscriptionAddress, 6, 4)}
            <Image
              src="/assets/icon/outline/copy.svg"
              className="mx-1"
              width={14}
              height={14}
              alt="copy"
              onClick={() => {
                copy(taskId);
              }}
            />
          </span>
        </span>
        <div className=" pl-2 flex flex-col flex-grow">
          <span>转入金额:</span>
          <span>{Math.ceil(fee) / 100000000} BTC</span>
          <div className="mt-2">订单状态：{formatStatus(status)}</div>
          <div className="flex-grow" />
          {status === "waiting_pay" && (
            <div
              className="border py-1 flex justify-center rounded-full"
              onClick={() => {
                onOpenWallet(inscriptionAddress, fee);
              }}
            >
              打开钱包
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDisplay;
