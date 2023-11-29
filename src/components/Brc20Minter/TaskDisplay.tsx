"use client";

import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
import copy from "copy-text-to-clipboard";
import { displaySixCharactersAround } from "./utils";

interface Props {
  taskId: string;
  inscriptionAddress: string;
  fee: number;
}

const TaskDisplay: React.FC<Props> = ({ taskId, inscriptionAddress, fee }) => {
  return (
    <div className="flex flex-col justify-center bg-white my-2 py-4">
      <div className="flex px-4 justify-between">
        <span>Task ID:</span>
        <span className="flex">
          <span>{displaySixCharactersAround(taskId)}</span>
          <Image
            src="/icon/copy.svg"
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
              src="/icon/copy.svg"
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
        </div>
      </div>
    </div>
  );
};

export default TaskDisplay;
