import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, hoursFromNow } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const GENERIC_MESSAGE =
  "Eğer bu e-posta adresiyle kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderilmiştir.";

export async function POST(request) {
  const ip = getClientIp(request);
  const ipLimit = await rateLimit(`forgot-password:ip:${ip}`, 10, 60 * 60 * 1000);
  if (!ipLimit.success) {
    return NextResponse.json(
      { error: "Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } }
    );
  }

  const { email } = await request.json();
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    // Still generic — don't confirm/deny format issues reveal much, but this
    // one is safe to flag since it's not account-specific.
    return NextResponse.json({ error: "Lütfen geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase();

  // Also rate-limit per email so someone can't be spammed with reset emails.
  const emailLimit = await rateLimit(`forgot-password:email:${normalizedEmail}`, 3, 60 * 60 * 1000);
  if (!emailLimit.success) {
    // Still return the generic message — don't reveal that this email has
    // been hitting the limit, which would itself leak that the account exists.
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Always behave the same whether or not the user exists.
  if (user) {
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = generateToken();
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt: hoursFromNow(1) },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "JurisLink Şifrenizi Sıfırlayın",
      html: `
        <p>Şifrenizi sıfırlamak için bir talep aldık.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Bu bağlantının süresi 1 saat içinde dolacaktır. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      `,
    });
  }

  return NextResponse.json({ message: GENERIC_MESSAGE });
}
