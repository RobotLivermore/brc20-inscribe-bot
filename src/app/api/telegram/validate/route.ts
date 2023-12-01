import { NextRequest } from "next/server";
import * as crypto from "crypto";

export const runtime = "edge";

export async function get(req: NextRequest): Promise<any> {
  console.log(req.url);
  return new Response(JSON.stringify({
    url: req.url,
    dir: console.dir(crypto)
  }), {
    status: 200,
  })
}