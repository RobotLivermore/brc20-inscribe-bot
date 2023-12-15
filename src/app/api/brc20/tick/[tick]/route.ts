import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { tick: string } }): Promise<any> {
  console.log(params)
  const baseUrl = process.env.ALPHA_BOT_URL

  if (!baseUrl) {
    throw new Error('ALPHA_BOT_URL not found')
  }
  const resp = await fetch(`${baseUrl}/api/brc20/tick/info/${params.tick}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
