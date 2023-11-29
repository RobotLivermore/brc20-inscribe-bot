
export const broardTx = async (txHex: string,  network="testnet") => {
  let net = ""
  if (network == "testnet") {
    net = "testnet/"
  }
  const base_url = "https://mempool.space/" + net + "api/tx"
  const resp = await fetch(base_url, {
    method: 'POST',
    body: txHex,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await resp.text();
  return data;
}