
export const dynamic = "force-dynamic";

export async function GET(): Promise<any> {
  const baseUrl = process.env.ALPHA_BOT_URL

  if (!baseUrl) {
    throw new Error('ALPHA_BOT_URL not found')
  }
  const resp = await fetch(`${baseUrl}/api/brc20/ticks/list`, {
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
