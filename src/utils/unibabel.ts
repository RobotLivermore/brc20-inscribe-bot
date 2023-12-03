'use client';

export function utf8ToBinaryString(str: string): string {
  const escstr = encodeURIComponent(str);
  let binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  });

  return binstr;
}

export function utf8ToBuffer(str: string): Uint8Array {
  const binstr = utf8ToBinaryString(str);
  const buf = binaryStringToBuffer(binstr);
  return buf;
}

export function utf8ToBase64(str: string): string {
  const binstr = utf8ToBinaryString(str);
  return btoa(binstr);
}

export function binaryStringToUtf8(binstr: string): string {
  const escstr = binstr.replace(/(.)/g, function (m, p) {
    let code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  });

  return decodeURIComponent(escstr);
}

export function bufferToUtf8(buf: Uint8Array): string {
  const binstr = bufferToBinaryString(buf);

  return binaryStringToUtf8(binstr);
}

export function base64ToUtf8(b64: string): string {
  const binstr = atob(b64);

  return binaryStringToUtf8(binstr);
}

export function bufferToBinaryString(buf: Uint8Array): string {
  const binstr = Array.prototype.map.call(buf, function (ch) {
    return String.fromCharCode(ch);
  }).join('');

  return binstr;
}

export function bufferToBase64(arr: Uint8Array): string {
  const binstr = bufferToBinaryString(arr);
  return btoa(binstr);
}

export function binaryStringToBuffer(binstr: string): Uint8Array {
  const buf = new Uint8Array(binstr.length);

  Array.prototype.forEach.call(binstr, function (ch, i) {
    buf[i] = ch.charCodeAt(0);
  });

  return buf;
}

export function base64ToBuffer(base64: string): Uint8Array {
  const binstr = atob(base64);
  const buf = binaryStringToBuffer(binstr);
  return buf;
}