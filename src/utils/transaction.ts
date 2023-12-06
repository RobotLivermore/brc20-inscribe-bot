import { Address, Signer, Tx, Tap } from "@cmdcode/tapscript";
import { UtxoInfo } from "@/types/wallet";
import { broadcastTx } from "@/api/chain";

export const estimateTxSize = (inputs: number, outputs: number) => {
  return inputs * 148 + outputs * 34 + 10 + inputs;
};

export const estimateTxFee = (
  inputs: number,
  outputs: number,
  feeRate: number
) => {
  return estimateTxSize(inputs, outputs) * feeRate;
};

export const selectUtxos = (
  utxos: UtxoInfo[],
  amount: number,
  feeRate: number
) => {
  let sum = 0;

  const selected: UtxoInfo[] = [];
  for (const utxo of utxos) {
    const spendAmount =
      amount + estimateTxSize(selected.length + 1, 2) * feeRate;
    selected.push(utxo);
    sum += utxo.value;
    if (sum >= spendAmount) {
      break;
    }
  }
  if (sum < amount + estimateTxSize(selected.length + 1, 2) * feeRate) {
    throw new Error("Insufficient balance");
  }

  return selected;
};

export const estimateTxFeeByUtxos = (
  utxos: UtxoInfo[],
  amount: number,
  feeRate: number
) => {
  const selected = selectUtxos(utxos, amount, feeRate);
  return estimateTxSize(selected.length, 2) * feeRate;
}

export const sendBTC = async (
  priv: string,
  utxos: UtxoInfo[],
  amount: number,
  feeRate: number,
  toAddress: string,
  changeAddress: string,
  network: "main" | "testnet"
) => {
  const selected = selectUtxos(utxos, amount, feeRate);
  console.log(selected);
  const inputs = selected.map((utxo) => ({
    txid: utxo.txid,
    vout: utxo.vout,
    value: utxo.value,
    address: changeAddress,
  }));

  console.log(Address.toScriptPubKey(changeAddress))

  const remainedValue = Math.floor(selected.reduce((sum, utxo) => sum + utxo.value, 0) - amount - estimateTxSize(selected.length , 2) * feeRate)

  console.log(remainedValue)
  const [tseckey] = Tap.getSecKey(priv);

  const txdata = Tx.create({
    vin: inputs.map((input) => ({
      txid: input.txid,
      vout: input.vout,
      prevout: {
        value: input.value,
        scriptPubKey: Address.toScriptPubKey(changeAddress),
      }})),
    vout: [
      {
        // We are locking up 99_000 sats (minus 1000 sats for fees.)
        value: amount,
        // We are locking up funds to this address.
        scriptPubKey: Address.toScriptPubKey(
          toAddress
        ),
      },
      {
        value: selected.reduce((sum, utxo) => sum + utxo.value, 0) - amount - estimateTxSize(selected.length , 2) * feeRate,
        scriptPubKey: Address.toScriptPubKey(
          changeAddress
        ),
      }
    ],
  });

  for (let i = 0; i < inputs.length; i++) {
    console.log("signing input", i)
    const sig = Signer.taproot.sign(priv, txdata, i);
    txdata.vin[i].witness = [sig];
  }

  // For verification, provided your
  // await Signer.taproot.verify(txdata, 0, { throws: true });

  const txhex = Tx.encode(txdata).hex;

  const result = await broadcastTx(txhex, network);

  if (result.includes('error')) {
    throw new Error(JSON.parse(result)?.message || result);
  }

  return  result;
}
