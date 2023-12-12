import { NextRequest } from "next/server";
import { Address, Signer, Tap, Tx } from "@cmdcode/tapscript";

import { broardTx } from "@/server/btc";

import { keys } from "@cmdcode/crypto-utils";

/*
铭刻过程
*/
export async function POST(req: NextRequest): Promise<any> {
  const requestData = await req.json();
  // 读取数据
  const secret = requestData.secret;
  const text = requestData.text;
  const receiveAddress = requestData.receiveAddress;
  const txid = requestData.txid;
  const vout = requestData.vout;
  const amount = requestData.amount
  const network = requestData?.network || 'testnet'
  console.log(requestData)

  const seckey = keys.get_seckey(secret);
  const pubkey = keys.get_pubkey(seckey, true);
  // Basic format of an 'inscription' script.
  const ec = new TextEncoder();
  const content = ec.encode(text);
  const mimetype = ec.encode("text/plain;charset=utf-8");

  const script = [
    pubkey,
    "OP_CHECKSIG",
    "OP_0",
    "OP_IF",
    ec.encode("ord"),
    "01",
    mimetype,
    "OP_0",
    content,
    "OP_ENDIF",
  ];

  // For tapscript spends, we need to convert this script into a 'tapleaf'.
  const tapleaf = Tap.encodeScript(script);
  // Generate a tapkey that includes our leaf script. Also, create a merlke proof
  // (cblock) that targets our leaf and proves its inclusion in the tapkey.
  const [tpubkey, cblock] = Tap.getPubKey(pubkey, { target: tapleaf });
  console.log("tpubkey", tpubkey);
  // A taproot address is simply the tweaked public key, encoded in bech32 format.
  const address = Address.p2tr.fromPubKey(tpubkey, network);
  console.log("Your address:", address, Address.toScriptPubKey(receiveAddress));

  const txdata = Tx.create({
    vin: [
      {
        // Use the txid of the funding transaction used to send the sats.
        txid: txid,
        // Specify the index value of the output that you are going to spend from.
        vout: vout,
        // Also include the value and script of that ouput.
        prevout: {
          // Feel free to change this if you sent a different amount.
          value: amount,
          // This is what our address looks like in script form.
          scriptPubKey: ["OP_1", tpubkey],
        },
      },
    ],
    vout: [
      {
        // We are leaving behind 1000 sats as a fee to the miners.
        value: 546,
        // This is the new script that we are locking our funds to.
        scriptPubKey: Address.toScriptPubKey(receiveAddress),
      },
    ],
  });

  // For this example, we are signing for input 0 of our transaction,
  // using the untweaked secret key. We are also extending the signature
  // to include a commitment to the tapleaf script that we wish to use.
  const sig = Signer.taproot.sign(seckey, txdata, 0, { extension: tapleaf });

  // Add the signature to our witness data for input 0, along with the script
  // and merkle proof (cblock) for the script.
  txdata.vin[0].witness = [sig, script, cblock];

  // Check if the signature is valid for the provided public key, and that the
  // transaction is also valid (the merkle proof will be validated as well).
  const isValid = Signer.taproot.verify(txdata, 0, { pubkey, throws: true });
  console.log("isValid", isValid);

  console.log("Your txhex:", Tx.encode(txdata).hex);
  const result = await broardTx(Tx.encode(txdata).hex, network);
  // await broadcast(Tx.encode(txdata).hex);
  return new Response(
    JSON.stringify({
      message: "ok",
      code: 0,
      data: {
        txHex: Tx.encode(txdata).hex,
        result,
      },
    }),
    {
      status: 200,
    }
  );
}
