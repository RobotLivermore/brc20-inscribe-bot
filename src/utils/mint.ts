import { NextRequest } from "next/server";
import { Address, Signer, Tap, Tx } from "@cmdcode/tapscript";

import { broardTx } from "@/server/btc";

import { keys } from "@cmdcode/crypto-utils";

function bytesToHex(bytes: Uint8Array) {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
}

export const generatePrivateKey = (): string => {
  const privkey =  keys.gen_seckey();
  const privString = bytesToHex(privkey);
  return privString
};

export const generateBrc20MintContent = (tick: string, amt: number): string => {
  const text = `{"p":"brc-20","op":"mint","tick":"${tick}","amt":"${Math.floor(amt)}"}`
  return text
}

/*
铭刻过程
*/
export function generateInscribe(secret: string, tick: string, amt: number, network: 'main' |'testnet' ): string {
  // 读取数据
  const text = generateBrc20MintContent(tick, amt)
  console.log(text)

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
  const [tpubkey] = Tap.getPubKey(pubkey, { target: tapleaf });
  console.log("tpubkey", tpubkey);
  // A taproot address is simply the tweaked public key, encoded in bech32 format.
  const address = Address.p2tr.fromPubKey(tpubkey, network);
  console.log("Your address:", address);
  return address
}