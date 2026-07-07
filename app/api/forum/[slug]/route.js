import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    const thread = await prisma.forumThread.findUnique({
      where: { slug },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!thread) {
      return NextResponse.json({ error: "Başlık bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error fetching forum thread:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
