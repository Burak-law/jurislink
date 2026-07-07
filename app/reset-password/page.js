import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Reset Password — JurisLink",
};

async function checkToken(token) {
  if (!token) return false;
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record) return false;
  if (record.expiresAt < new Date()) return false;
  return true;
}

export default async function ResetPasswordPage({ searchParams }) {
  const token = searchParams?.token;
  const isValid = await checkToken(token);

  return (
    <>
      <Header />
      <section className="px-6 md:px-16 py-16 max-w-md mx-auto">
        <h1 className="font-heading font-bold text-juris-cream text-3xl mb-2 text-center">
          Reset your password.
        </h1>

        {isValid ? (
          <>
            <p className="text-juris-cream/60 text-sm text-center mb-8">
              Choose a new password below.
            </p>
            <div className="border border-juris-cream/10 bg-juris-cream/[0.03] rounded-sm p-8">
              <ResetPasswordForm token={token} />
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-juris-cream/60 text-sm mb-8">
              This link is invalid or has expired. Request a new one below.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block bg-juris-burgundy text-juris-cream font-semibold px-6 py-3 rounded-sm hover:bg-juris-burgundy/90 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
