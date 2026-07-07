import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ content: null });
  }

  const { searchParams } = new URL(request.url);
  const practiceSlug = searchParams.get("slug");
  if (!practiceSlug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  const draft = await prisma.essayDraft.findUnique({
    where: { userId_practiceSlug: { userId: session.user.id, practiceSlug } },
  });

  return NextResponse.json({ content: draft?.content ?? null });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { practiceSlug, content } = await request.json();
  if (!practiceSlug) {
    return NextResponse.json({ error: "Missing practiceSlug." }, { status: 400 });
  }

  const draft = await prisma.essayDraft.upsert({
    where: { userId_practiceSlug: { userId: session.user.id, practiceSlug } },
    update: { content: content ?? "" },
    create: { userId: session.user.id, practiceSlug, content: content ?? "" },
  });

  return NextResponse.json({ updatedAt: draft.updatedAt });
}
