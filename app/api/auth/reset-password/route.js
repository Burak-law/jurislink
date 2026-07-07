import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  const ip = getClientIp(request);
  const limited = await rateLimit(`reset-password:${ip}`, 10, 60 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Missing token or password." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record) {
    return NextResponse.json({ error: "This reset link isn't valid." }, { status: 400 });
  }
  if (record.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { id: record.id } });
    return NextResponse.json({ error: "This reset link has expired." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });

  // Invalidate every outstanding reset token for this user, not just the one used.
  await prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } });

  return NextResponse.json({ message: "Password updated." });
}
