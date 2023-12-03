const str = (s: unknown): s is string => typeof s === 'string'; 
const err = (m = ''): never => { throw new Error(m); }; // error helper, messes-up stack trace
const u8n = (data?: any) => new Uint8Array(data);       // creates Uint8Array

export function bytesToHex(bytes: Uint8Array) {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
}

export const hexToBytes = (hex: string): Uint8Array => {
  // hex to bytes
  const l = hex.length; // error if not string,
  if (!str(hex) || l % 2) err("hex invalid 1"); // or has odd length like 3, 5.
  const arr = u8n(l / 2); // create result array
  for (let i = 0; i < arr.length; i++) {
    const j = i * 2;
    const h = hex.slice(j, j + 2); // hexByte. slice is faster than substr
    const b = Number.parseInt(h, 16); // byte, created from string part
    if (Number.isNaN(b) || b < 0) err("hex invalid 2"); // byte must be valid 0 <= byte < 256
    arr[i] = b;
  }
  return arr;
};

export const toXOnly = (pubKey: any) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);