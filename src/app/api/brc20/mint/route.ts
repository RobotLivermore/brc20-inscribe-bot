import { NextRequest } from "next/server";


export async function POST(req: NextRequest): Promise<any> {
  const requestData = await req.json();

  // TODO: validate requestData

  const baseUrl = process.env.ALPHA_BOT_URL

  if (!baseUrl) {
    throw new Error('ALPHA_BOT_URL not found')
  }

  const resp = await fetch(`${baseUrl}/api/brc20/mint`, {
    method: 'POST',
    body: JSON.stringify({
      tick: requestData.tick,
      amt: requestData.amt,
      receive_address: requestData.receiveAddress,
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    status: 200,
  })
}
