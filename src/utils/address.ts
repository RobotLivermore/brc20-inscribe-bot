import { HDKey } from "@scure/bip32";
import { keys } from "@cmdcode/crypto-utils";
import { Address, Tap } from "@cmdcode/tapscript";
import { mnemonicToSeedSync } from "bip39";
import { encrypt, decrypt } from "@/utils/browser-passworder";
import { WalletCore } from "@/types/wallet";

export const generateAddressFromPubKey = (pubkey: string, network?: 'main' | 'testnet') => {
  const [tpubkey] = Tap.getPubKey(pubkey);
  const address = Address.p2tr.encode(tpubkey, network);
  return address;
}

export const getPrivFromMnemonic = (mnemonic: string) => {
  const seed = mnemonicToSeedSync(mnemonic, "");
  console.log("seed", seed.toString("hex"));
  const hdWallet = HDKey.fromMasterSeed(seed);
  // "m/86'/0'/0'/0/0"
  const root = hdWallet.derive("m/86'/0'/0'/0/0");

  const seckey = keys.get_seckey(root.privateKey as Uint8Array);

  return seckey.to_hex();
}

export const generateWalletCore = async (
  mnemonic: string,
  password: string,
  network?: 'main' | 'testnet'
) => {
  const seed = mnemonicToSeedSync(mnemonic, "");
  console.log("seed", seed.toString("hex"));
  const hdWallet = HDKey.fromMasterSeed(seed);
  // "m/86'/0'/0'/0/0"
  const root = hdWallet.derive("m/86'/0'/0'/0/0");

  const seckey = keys.get_seckey(root.privateKey as Uint8Array);
  const pubkey = keys.get_pubkey(seckey, true);
  // const [tpubkey] = Tap.getPubKey(pubkey);
  // const address =  Address.p2tr.encode(tpubkey, network);
  const address = generateAddressFromPubKey(pubkey.to_hex(), network);

  const payload = await encrypt(password, mnemonic);

  const newWallet = {
    encryptedSeed: payload,
    taprootAddress: address,
    publicKey: pubkey.to_hex(),
    network: network || 'main',
  } as WalletCore;

  return newWallet;
};

export const decryptSeed = async (encryptedSeed: string, password: string) => {
  try {
    const decryptedWallet = await decrypt(password, encryptedSeed);
    console.log(decryptedWallet);
  } catch (error) {
    console.log(error);
  }
};

