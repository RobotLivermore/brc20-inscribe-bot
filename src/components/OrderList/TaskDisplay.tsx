"use client";

import Image from "next/image";
import { abbreviateText } from "@/utils/formater";
import useCopy from "@/hooks/useCopy";

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
  createdAt: number;
  secret?: string;
  onOpenWallet: (address: string, satsAmount: number) => void;
}

const TaskDisplay: React.FC<Props> = ({
  taskId,
  inscriptionAddress,
  fee,
  status,
  secret,
  createdAt,
}) => {
  const copy = useCopy();
  return (
    <div className="flex flex-col justify-center bg-white my-2 py-4 rounded-lg text-xs">
      <div className="flex px-4 justify-between">
        <span>Order ID:</span>
        <span className="flex">
          <span>{abbreviateText(taskId)}</span>
          <Image
            src="/assets/icon/outline/copy.svg"
            className="mx-1"
            width={12}
            height={12}
            alt="copy"
            onClick={() => {
              copy(taskId);
            }}
          />
        </span>
      </div>
      <div className="flex justify-between mt-2 px-4">
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between">
            <span>铭刻地址:</span>
            <span
              className="flex flex-col"
              onClick={() => {
                copy(inscriptionAddress);
              }}
            >
              <span className="flex">
                {abbreviateText(inscriptionAddress, 8, 8)}
                <Image
                  src="/assets/icon/outline/copy.svg"
                  className="mx-1"
                  width={12}
                  height={12}
                  alt="copy"
                  onClick={() => {
                    copy(taskId);
                  }}
                />
              </span>
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>转入金额:</span>
            <span>{Math.ceil(fee) / 100000000} BTC</span>
          </div>

          <div className="mt-2 flex justify-between">
            <span>订单状态：</span>
            <span>{formatStatus(status)}</span>
          </div>
          <div className="flex-grow" />
          {secret && (
            <div className="flex mt-2 justify-between">
              <span>交易私钥</span>
              <span className="flex">
                {abbreviateText(secret, 8, 8)}{" "}
                <Image
                  src="/assets/icon/outline/copy.svg"
                  className="mx-1"
                  width={12}
                  height={12}
                  alt="copy"
                  onClick={() => {
                    copy(taskId);
                  }}
                />
              </span>
            </div>
          )}
          <div className="mt-2">
            {createdAt && <span>{new Date(createdAt).toLocaleString()}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDisplay;
