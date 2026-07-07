"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm({ token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setIsSubmitting(false);
        return;
      }

      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <p className="text-juris-cream/80 text-sm text-center">
        Password updated. Redirecting you to log in…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="password" className="block text-juris-cream/70 text-sm mb-1.5">
          New Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full px-4 py-3 bg-juris-cream text-juris-navy placeholder-juris-navy/40 rounded-sm focus:outline-none focus:ring-2 focus:ring-juris-burgundy"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-juris-cream/70 text-sm mb-1.5">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-juris-cream text-juris-navy placeholder-juris-navy/40 rounded-sm focus:outline-none focus:ring-2 focus:ring-juris-burgundy"
        />
      </div>

      {error && <p className="text-juris-burgundy text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-juris-burgundy text-juris-cream font-semibold py-3 rounded-sm hover:bg-juris-burgundy/90 transition-colors mt-2 disabled:opacity-60"
      >
        {isSubmitting ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
