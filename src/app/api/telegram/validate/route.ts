import { NextRequest } from "next/server";
import CryptoJS from "crypto-js";

export const runtime = "edge";

const botToken = process.env.TELEGRAM_BOT_TOKEN;

const verifyTelegramWebAppData = async (
  telegramInitData: string,
  botToken: string
): Promise<boolean> => {
  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get("hash");
  let dataToCheck: string[] = [];

  initData.sort();
  initData.forEach(
    (val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`)
  );

  const secret = CryptoJS.HmacSHA256(botToken, "WebAppData");
  const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(
    CryptoJS.enc.Hex
  );

  return _hash === hash;
};

export async function POST(req: NextRequest): Promise<any> {
  const requestData = await req.json();
  const initData = requestData.initData;
  const isValid = await verifyTelegramWebAppData(initData, botToken as string);

  if (!isValid) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Invalid data",
      }),
      {
        status: 400,
      }
    );
  }

  return new Response(
    JSON.stringify({
      code: 0,
      message: "success"
    }),
    {
      status: 200,
    }
  );
}
