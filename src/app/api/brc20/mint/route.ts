import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<any> {
  const requestData = await req.json();
  console.log(requestData)

  // TODO: validate requestData

  const resp = await fetch('http://54.242.228.134:8000/api/brc20/mint', {
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
