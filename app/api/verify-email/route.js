import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ status: "missing" }, { status: 400 });
    }

    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record) {
      return NextResponse.json({ status: "invalid" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: record.id } });
      return NextResponse.json({ status: "expired" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    });
    
    await prisma.verificationToken.delete({ where: { id: record.id } });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
