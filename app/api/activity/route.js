import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = ["quiz_completed"];

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { type, targetTitle, targetSlug, resultCorrect, resultTotal } =
    await request.json();

  if (!ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Unsupported activity type." }, { status: 400 });
  }
  if (!targetTitle) {
    return NextResponse.json({ error: "Missing targetTitle." }, { status: 400 });
  }

  const activity = await prisma.activity.create({
    data: {
      userId: session.user.id,
      type,
      targetTitle,
      targetSlug: targetSlug ?? null,
      resultCorrect: typeof resultCorrect === "number" ? resultCorrect : null,
      resultTotal: typeof resultTotal === "number" ? resultTotal : null,
    },
  });

  return NextResponse.json({ id: activity.id }, { status: 201 });
}
