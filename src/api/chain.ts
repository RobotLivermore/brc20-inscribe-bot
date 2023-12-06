import { UtxoInfo } from '@/types/wallet'

export const fetchChainFeeRate = async (network: "main" | "testnet") => {
  const url =
    network === "main"
      ? "https://mempool.space/api/v1/fees/recommended"
      : "https://mempool.space/testnet/api/v1/fees/recommended";
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};

interface AddressStatInfo {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

export const fetchChainBalance = async (
  address: string,
  network: "main" | "testnet"
) => {
  const url =
    network === "main"
      ? `https://mempool.space/api/address/${address}`
      : `https://mempool.space/testnet/api/address/${address}`;
  const resp = await fetch(url);
  const data = (await resp.json()) as AddressStatInfo;
  return data;
};

export const fetchChainTx = async (
  txid: string,
  network: "main" | "testnet"
) => {
  const url =
    network === "main"
      ? `https://mempool.space/api/tx/${txid}`
      : `https://mempool.space/testnet/api/tx/${txid}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};

export const fetchChainTxHex = async (
  txid: string,
  network: "main" | "testnet"
) => {
  const url =
    network === "main"
      ? `https://mempool.space/api/tx/${txid}/hex`
      : `https://mempool.space/testnet/api/tx/${txid}/hex`;
  const resp = await fetch(url);
  const data = await resp.text();
  return data;
};

export const fetchChainTxList = async (
  address: string,
  network: "main" | "testnet"
) => {
  const url =
    network === "main"
      ? `https://mempool.space/api/address/${address}/txs`
      : `https://mempool.space/testnet/api/address/${address}/txs`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};

export const fetchChainTxListByBlock = async (
  block: number,
  network: "main" | "testnet"
) => {
  const url =
    network === "main"
      ? `https://mempool.space/api/block/${block}/txids`
      : `https://mempool.space/testnet/api/block/${block}/txids`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};

export const fetchChainBlock = async (
  block: number,
  network: "main" | "testnet"
) => {
  const url =
    network === "main"
      ? `https://mempool.space/api/block/${block}`
      : `https://mempool.space/testnet/api/block/${block}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
};


export const fetchAddressUtxo = async (
  address: string,
  network: "main" | "testnet"
) => {
  const url =
    network === "main"
      ? `https://mempool.space/api/address/${address}/utxo`
      : `https://mempool.space/testnet/api/address/${address}/utxo`;
  const resp = await fetch(url);
  const data = await resp.json() as UtxoInfo[];
  return data;
};

export const broadcastTx = async (
  txHex: string,
  network: "main" | "testnet"
) => {
  const url =
    network === "main"
      ? `https://mempool.space/api/tx`
      : `https://mempool.space/testnet/api/tx`;
  const resp = await fetch(url, {
    method: "POST",
    body: txHex,
  });
  const data = await resp.text();
  return data;
}