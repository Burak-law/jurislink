import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { threadId, content, authorName } = await req.json();

    if (!threadId || !content || !authorName) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const reply = await prisma.forumReply.create({
      data: {
        content,
        authorName,
        threadId,
      }
    });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Error creating forum reply:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
