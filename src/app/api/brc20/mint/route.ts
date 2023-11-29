import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<any> {
  console.log(await req.json());
  // sleep 1s
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
  return new Response(JSON.stringify({
    inscriptionAddress: '0x1234567890'
  }), {
    status: 200,
  })
}
