"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(
        data.message ||
          data.error ||
          "If an account exists for that email, we've sent a password reset link."
      );
      setStatus("done");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center">
        <p className="text-juris-cream/80 text-sm mb-6">{message}</p>
        <Link
          href="/login"
          className="text-juris-cream/70 hover:text-juris-cream underline text-sm"
        >
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-juris-cream/70 text-sm mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@lawschool.edu"
          className="w-full px-4 py-3 bg-juris-cream text-juris-navy placeholder-juris-navy/40 rounded-sm focus:outline-none focus:ring-2 focus:ring-juris-burgundy"
        />
      </div>

      {message && <p className="text-juris-burgundy text-sm">{message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-juris-burgundy text-juris-cream font-semibold py-3 rounded-sm hover:bg-juris-burgundy/90 transition-colors mt-2 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Reset Link"}
      </button>

      <p className="text-juris-cream/40 text-xs text-center mt-2">
        <Link href="/login" className="text-juris-cream/70 hover:text-juris-cream underline">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
