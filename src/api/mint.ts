
export const fetchBrc20MintInscriptionAddress = async (tick: string, amt: number, receiveAddress: string) => {
  const resp = await fetch('/api/brc20/mint', {
    method: 'POST',
    body: JSON.stringify({
      tick,
      amt,
      receiveAddress
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await resp.json();
  return data.inscriptionAddress;
}