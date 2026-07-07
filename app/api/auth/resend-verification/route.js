import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { generateToken, hoursFromNow } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Lütfen önce giriş yapın." }, { status: 401 });
  }

  const limited = await rateLimit(`resend-verification:${session.user.id}`, 3, 60 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Hesap bulunamadı." }, { status: 404 });
  }
  if (user.emailVerified) {
    return NextResponse.json({ message: "E-posta adresiniz zaten doğrulanmış." });
  }

  // Clear out any old tokens for this user before issuing a new one.
  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

  const token = generateToken();
  await prisma.verificationToken.create({
    data: { token, userId: user.id, expiresAt: hoursFromNow(24) },
  });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "JurisLink E-posta Doğrulaması",
    html: `
      <p>İşte yeni doğrulama bağlantınız:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>Bu bağlantının geçerlilik süresi 24 saattir.</p>
    `,
  });

  return NextResponse.json({ message: "Doğrulama e-postası gönderildi." });
}
