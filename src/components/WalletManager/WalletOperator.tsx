"use client";

import { WalletCore } from "@/types/wallet";
import { FC, useState, useEffect, useCallback, use } from "react";
import { generateAddressFromPubKey } from "@/utils/address";
import { abbreviateText } from "@/utils/formater";
import Button from "@/ui/Button";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";
import useToast from "@/hooks/useToast";
import ReceiveModal from "./ReceiveModal";
import SendModal from "./SendModal";
import { fetchChainBalance, fetchAddressUtxo } from "@/api/chain";
import { ReactSVG } from "react-svg";
import TransactionConfirm from "../TransactionConfirm";
import useNetwork from "@/hooks/useNetwork";
import useCopy from "@/hooks/useCopy";

interface Props {
  wallet: WalletCore;
  onDeleteWallet: () => void;
}

const WalletOperator: FC<Props> = ({ wallet, onDeleteWallet }) => {
  const { t } = useTranslation();
  const copy = useCopy();

  const [address, setAddress] = useState<string>("");
  const [network, setNetwork] = useNetwork();

  const [page, setPage] = useState<"home" | "setting">("home");

  const [balance, setBalance] = useState<number>(0);
  const [utxos, setUtxos] = useState<any[]>([]);

  useEffect(() => {
    if (wallet?.publicKey) {
      const _addr = generateAddressFromPubKey(wallet.publicKey, network);
      setAddress(_addr);
    }
  }, [network, wallet.publicKey]);

  const updateBalance = useCallback(async () => {
    const balanceInfo = await fetchChainBalance(address, network);
    const b =
      balanceInfo.chain_stats.funded_txo_sum -
      balanceInfo.chain_stats.spent_txo_sum +
      balanceInfo.mempool_stats.funded_txo_sum -
      balanceInfo.mempool_stats.spent_txo_sum;
    setBalance(b);
  }, [address, network]);

  useEffect(() => {
    if (address) {
      updateBalance();
    }
  }, [address, updateBalance]);

  const updateUtxos = useCallback(async () => {
    const utxos = await fetchAddressUtxo(address, network);
    setUtxos(utxos);
  }, [address, network]);

  useEffect(() => {
    if (address) {
      updateUtxos();
    }
  }, [address, updateUtxos]);

  useEffect(() => {
    if (address) {
      updateUtxos();
    }
  }, [address, updateUtxos]);

  const toast = useToast();

  const [isOpenReceiveModal, setIsOpenReceiveModal] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsOpenReceiveModal(false);
  }, []);

  const [isOpenSendModal, setIsOpenSendModal] = useState<boolean>(false);
  const handleCloseSendModal = useCallback(() => {
    setIsOpenSendModal(false);
  }, []);

  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full max-w-[calc(100vw - 32px)] bg-white rounded-xl border border-black">
      <div className="border-b border-black w-full flex justify-center items-center h-16 relative">
        <span
          className="py-1 px-2 rounded-md cursor-pointer active:bg-gray-100"
          onClick={() => {
            copy(address);
          }}
        >
          {abbreviateText(address, 4)}
        </span>
        <div
          className="absolute flex items-center justify-center right-2 top-[14px] p-2 rounded cursor-pointer active:bg-gray-200"
          onClick={() => {
            if (page === "home") {
              setPage("setting");
            } else {
              setPage("home");
            }
          }}
        >
          {page === "home" && (
            <ReactSVG
              src="/assets/icon/outline/setting.svg"
              className="w-4 h-4 text-black"
            />
          )}
          {page === "setting" && (
            <ReactSVG
              src="/assets/icon/outline/wallet.svg"
              className="w-4 h-4 text-black"
            />
          )}
        </div>
      </div>
      {page === "home" && (
        <div className="flex flex-col items-center p-4 pt-6 pb-8">
          <span className="text-sm">{t("wallet.homeTitle")}</span>
          <span className="mt-8 text-2xl font-bold">{`${balance / 100000000} ${
            network === "main" ? "BTC" : "tBTC"
          }`}</span>
          <div className="grid grid-cols-2 gap-4 mt-10 w-full">
            <Button
              theme="outline"
              text={t("wallet.send")}
              className=""
              onClick={() => {
                setIsOpenSendModal(true);
              }}
            />
            <Button
              theme="outline"
              text={t("wallet.receive")}
              className=""
              onClick={() => {
                setIsOpenReceiveModal(true);
              }}
            />
          </div>
        </div>
      )}
      {page === "setting" && (
        <div className="flex flex-col items-center p-4 pt-6 pb-8">
          <span className="text-xl text-left w-full">
            {t("wallet.settingTitle")}
          </span>
          <div className="w-full mt-4 flex flex-col">
            <label className="text-sm">{t("wallet.networkSelector")}</label>
            <select
              className="select select-primary w-full mt-2"
              value={network}
              onChange={(e) => {
                setNetwork(e.target.value as "main" | "testnet");
              }}
            >
              <option value="main">Mainnet</option>
              <option value="testnet">Testnet</option>
            </select>
          </div>

          <Button
            theme="danger"
            text={t("wallet.deleteWallet")}
            className="mt-10 w-full"
            onClick={() => {
              setIsConfirmDelete(true);
            }}
          />
        </div>
      )}
      <ReceiveModal
        address={address}
        visible={isOpenReceiveModal}
        onClose={handleClose}
      />
      <SendModal
        network={network}
        balance={balance}
        utxos={utxos}
        visible={isOpenSendModal}
        onClose={handleCloseSendModal}
        wallet={wallet}
        onUpdate={updateBalance}
      />
      <TransactionConfirm
        visible={isConfirmDelete}
        onClose={() => {
          setIsConfirmDelete(false);
        }}
        onConfirm={() => {
          onDeleteWallet();
          setIsConfirmDelete(false);
        }}
      />
      <Toaster />
    </div>
  );
};

export default WalletOperator;
