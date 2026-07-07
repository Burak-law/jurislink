import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { generateToken, hoursFromNow } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Lütfen önce giriş yapın." }, { status: 401 });
  }

  const limited = await rateLimit(`profile-update:${session.user.id}`, 10, 60 * 60 * 1000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const { name, email } = await request.json();

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "İsim boş bırakılamaz." }, { status: 400 });
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: "Lütfen geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase();

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!currentUser) {
    return NextResponse.json({ error: "Hesap bulunamadı." }, { status: 404 });
  }

  const emailChanged = normalizedEmail !== currentUser.email;

  if (emailChanged) {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresi başka bir hesap tarafından kullanılıyor." },
        { status: 409 }
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      email: normalizedEmail,
      // Changing your email means we can no longer be sure it's yours —
      // require re-verification, same as a brand-new signup.
      ...(emailChanged ? { emailVerified: null } : {}),
    },
  });

  if (emailChanged) {
    await prisma.verificationToken.deleteMany({ where: { userId: updatedUser.id } });

    const token = generateToken();
    await prisma.verificationToken.create({
      data: { token, userId: updatedUser.id, expiresAt: hoursFromNow(24) },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: updatedUser.email,
      subject: "Yeni JurisLink e-posta adresinizi onaylayın",
      html: `
        <p>JurisLink hesabınızdaki e-posta adresini değiştirdiniz.</p>
        <p>Lütfen aşağıdaki bağlantıya tıklayarak bu yeni adresi onaylayın:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Bu bağlantının süresi 24 saat içinde dolacaktır. Eğer bu değişikliği siz yapmadıysanız, lütfen destek ekibiyle iletişime geçin.</p>
      `,
    });
  }

  return NextResponse.json({
    name: updatedUser.name,
    email: updatedUser.email,
    emailChanged,
  });
}
