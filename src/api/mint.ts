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
  receiveAddress: string
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
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data?.data;
};
