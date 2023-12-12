import { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest): Promise<any> {
  const requestData = await req.json();

  const task = await prisma.inscribe_text_tasks.create({
    data: {
      id: requestData.id,
      user_id: requestData.userId,
      secret: requestData.secret,
      text: requestData.text,
      receive_address: requestData.receiveAddress,
      inscribe_address: requestData.inscribeAddress,
      status: requestData.status,
      created_at: requestData.createdAt,
      updated_at: requestData.updatedAt,
    }
  })

  return new Response(JSON.stringify({
    code: 0,
    data: task,
  }), {
    status: 200,
  })
}
