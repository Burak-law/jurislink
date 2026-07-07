"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in every field.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setIsSubmitting(false);

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-juris-text/80 font-bold text-sm mb-1.5">
          Ad Soyad
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Av. Burak Abalak"
          className="w-full px-4 py-3 bg-white border border-slate-200 text-juris-text placeholder-juris-text/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-juris-accent transition-all"
        />
      </div>

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
        <label htmlFor="password" className="block text-juris-text/80 font-bold text-sm mb-1.5">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="En az 8 karakter"
          className="w-full px-4 py-3 bg-white border border-slate-200 text-juris-text placeholder-juris-text/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-juris-accent transition-all"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-juris-text/80 font-bold text-sm mb-1.5">
          Şifre Tekrar
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-white border border-slate-200 text-juris-text placeholder-juris-text/40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-juris-accent transition-all"
        />
      </div>

      {error && <p className="text-red-500 font-bold text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-juris-accent text-white font-bold py-3 rounded-lg hover:bg-juris-accent/90 transition-transform hover:scale-[1.02] shadow-sm mt-2 disabled:opacity-60 disabled:hover:scale-100"
      >
        {isSubmitting ? "Hesap oluşturuluyor…" : "Hesap Oluştur"}
      </button>

      <p className="text-juris-text/60 font-medium text-xs text-center mt-2">
        Zaten bir hesabınız var mı?{" "}
        <Link href="/login" className="text-juris-accent hover:text-juris-accent/80 font-bold underline transition-colors">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
