export interface WalletCore {
  encryptedSeed: string;
  taprootAddress: string;
  publicKey: string;
  network?: "main" | "testnet";
}

export interface UtxoInfo {
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  txid: string;
  vout: number;
  value: number;
}
