import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { password } = await request.json();
  if (!password) {
    return NextResponse.json(
      { error: "Please enter your password to confirm." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
  }

  // Cascades to VerificationToken, PasswordResetToken, Activity, and
  // EssayDraft rows via the `onDelete: Cascade` relations in schema.prisma.
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ message: "Account deleted." });
}
