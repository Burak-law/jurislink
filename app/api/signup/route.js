import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken, hoursFromNow } from "@/lib/tokens";
import { sendEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limited = await rateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
    if (!limited.success) {
      return NextResponse.json(
        { error: "Çok fazla kayıt denemesi yaptınız. Lütfen daha sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
      );
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Lütfen geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Şifreniz en az 8 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresiyle kayıtlı bir hesap zaten var." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email: normalizedEmail, passwordHash },
    });

    // Create a verification token and "send" the verification email.
    const token = generateToken();
    await prisma.verificationToken.create({
      data: { token, userId: user.id, expiresAt: hoursFromNow(24) },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "JurisLink E-posta Doğrulaması",
      html: `
        <p>JurisLink'e hoş geldiniz, ${user.name}.</p>
        <p>Lütfen aşağıdaki bağlantıya tıklayarak e-posta adresinizi doğrulayın:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>Bu bağlantının geçerlilik süresi 24 saattir.</p>
      `,
    });

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Bir şeyler ters gitti. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
