import { NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest): Promise<any> {
  const requestData = await req.json();

  const task = await prisma.inscribe_text_tasks.findMany({
    where: {
      user_id: requestData.userId,
    },
    select: {
      id: true,
      user_id: true,
      secret: false,
      text: true,
      receive_address: true,
      inscribe_address: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });

  return new Response(
    JSON.stringify({
      code: 0,
      data: task,
    }),
    {
      status: 200,
    }
  );
}
