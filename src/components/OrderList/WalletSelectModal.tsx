"use client";

import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const WalletSelectModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[clac(100vw - 32px)] max-w-sm transform overflow-hidden rounded-2xl bg-white border p-6 text-left align-middle shadow-xl transition-all">
                {/* <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              
            </Dialog.Title> */}
                <div className="flex flex-col items-center space-y-4">
                  <Link
                    href="okx://main"
                    target="_blank"
                    className="flex bg-black py-2 px-2 justify-center w-64 rounded-full"
                  >
                    <Image src="/assets/okx.svg" alt="okx" width={20} height={20} />
                    <span className="text-white ml-2">OKX Wallet</span>
                  </Link>
                  <Link
                    href="https://t.me/wallet"
                    target="_blank"
                    className="flex bg-[#54a9eb] py-2 px-2 justify-center w-64 rounded-full"
                  >
                    <Image src="/assets/telegram.svg" alt="telegram" width={20} height={20} />
                    <span className="text-white ml-2">Telegram Wallet</span>
                  </Link>
                  {/* <input value={url} onChange={(e) => setUrl(e.target.value)} type="text" placeholder="okx" className="border" />
              <a href={url} target="_blank">
                打开钱包
              </a> */}
                </div>
                {/* <script async src="
              <a href="okx" />
            </div>
            {/* <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-share-url="https://core.telegram.org/widgets/share"></script> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WalletSelectModal;
