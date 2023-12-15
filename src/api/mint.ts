import { v4 as uuidv4 } from "uuid";

export const fetchBrc20MintInscriptionAddress = async (
  tick: string,
  amt: number,
  receiveAddress: string
) => {
  const resp = await fetch("/api/brc20/mint", {
    method: "POST",
    body: JSON.stringify({
      tick,
      amt,
      receiveAddress,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data?.data;
};

export const createOrder = async (
  priv: string,
  tick: string,
  amt: number,
  receiveAddress: string
) => {
  const resp = await fetch("/api/brc20/mint", {
    method: "POST",
    body: JSON.stringify({
      priv,
      tick,
      amt,
      receiveAddress,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data?.data;
}

export const createTextInscriptionTask = async (
  userId: string,
  secret: string,
  text: string,
  receiveAddress: string,
  inscribeAddress: string,
  status: string,
) => {
  const resp = await fetch("/api/brc20/tasks/create", {
    method: "POST",
    body: JSON.stringify({
      id: uuidv4(),
      userId,
      secret,
      text,
      receiveAddress,
      inscribeAddress,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data?.data;
}

export const fetchBrc20MintPaid = async (
  taskId: string,
  txid: string,
  vout: number,
  amount: number
) => {
  const resp = await fetch("/api/brc20/mint/paid", {
    method: "POST",
    body: JSON.stringify({
      taskId,
      txid,
      vout,
      amount,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data?.data;
};

export const inscribeBrc20Mint = async (
  secret: string,
  text: string,
  txid: string,
  vout: number,
  amount: number,
  receiveAddress: string,
  network: "main" | "testnet"
) => {
  const resp = await fetch("/api/brc20/inscribe", {
    method: "POST",
    body: JSON.stringify({
      secret,
      text,
      txid,
      vout,
      amount,
      receiveAddress,
      network,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data?.data;
};


export const fetchTickInfo = async (tick: string) => {
  const resp = await fetch(`/api/brc20/tick/${tick}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data?.data;
}