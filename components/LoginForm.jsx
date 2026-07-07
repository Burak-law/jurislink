"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both your email and password.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError(
        result.error === "CredentialsSignin"
          ? "Incorrect email or password."
          : result.error
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-juris-text/80 font-bold text-sm mb-1.5">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="isim@universite.edu"
          className="w-full px-4 py-3 bg-white border border-slate-200 text-juris-text placeholder-juris-text/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-juris-accent transition-all"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-juris-text/80 font-bold text-sm">
            Şifre
          </label>
          <Link
            href="/forgot-password"
            className="text-juris-accent/80 text-xs font-semibold hover:text-juris-accent transition-colors underline"
          >
            Şifremi unuttum?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-white border border-slate-200 text-juris-text placeholder-juris-text/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-juris-accent transition-all"
        />
      </div>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-juris-accent text-white font-bold py-3 rounded-lg hover:bg-juris-accent/90 transition-transform hover:scale-[1.02] shadow-sm mt-2 disabled:opacity-60 disabled:hover:scale-100"
      >
        {isSubmitting ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>

      <p className="text-juris-text/60 font-medium text-xs text-center mt-2">
        Henüz hesabınız yok mu?{" "}
        <Link href="/signup" className="text-juris-accent hover:text-juris-accent/80 font-bold underline transition-colors">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
