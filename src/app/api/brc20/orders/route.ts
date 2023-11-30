import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<any> {
  const requestData = await req.json();

  // TODO: validate requestData

  const resp = await fetch('http://127.0.0.1:8000/api/brc20/mint/tasks/status', {
    method: 'POST',
    body: JSON.stringify({
      ids: requestData.ids,
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
