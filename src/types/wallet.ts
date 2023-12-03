export interface WalletCore {
  encryptedSeed: string;
  taprootAddress: string;
  publicKey: string;
  network?: 'main' | 'testnet';
}
