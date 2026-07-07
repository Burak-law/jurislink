"use client";

import { useState } from "react";
import Link from "next/link";

const copy = {
  success: {
    title: "Your email is verified.",
    body: "Thanks for confirming your address — you're all set.",
  },
  expired: {
    title: "That link has expired.",
    body: "Verification links are valid for 24 hours. Log in and request a new one from your dashboard.",
  },
  invalid: {
    title: "That link isn't valid.",
    body: "It may have already been used. Log in and request a new verification email if needed.",
  },
  missing: {
    title: "No verification token found.",
    body: "Please use the link from your verification email.",
  },
  error: {
    title: "An error occurred.",
    body: "Something went wrong while verifying your email. Please try again later.",
  }
};

export default function VerifyEmailClient({ token }) {
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      setStatus("missing");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await res.json();
      setStatus(data.status || "error");
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "idle") {
    return (
      <section className="px-6 md:px-16 py-24 max-w-md mx-auto text-center">
        <p className="text-juris-burgundy text-xs uppercase tracking-[0.3em] font-semibold mb-4">
          Email Verification
        </p>
        <h1 className="font-heading font-bold text-juris-cream text-2xl md:text-3xl mb-4">
          Ready to verify?
        </h1>
        <p className="text-juris-cream/60 text-sm mb-8">
          Click the button below to securely verify your email address.
        </p>
        <button
          onClick={handleVerify}
          disabled={loading}
          className="inline-block bg-juris-burgundy text-juris-cream font-semibold px-6 py-3 rounded-sm hover:bg-juris-burgundy/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </section>
    );
  }

  const { title, body } = copy[status] || copy.error;

  return (
    <section className="px-6 md:px-16 py-24 max-w-md mx-auto text-center">
      <p className="text-juris-burgundy text-xs uppercase tracking-[0.3em] font-semibold mb-4">
        Email Verification
      </p>
      <h1 className="font-heading font-bold text-juris-cream text-2xl md:text-3xl mb-4">
        {title}
      </h1>
      <p className="text-juris-cream/60 text-sm mb-8">{body}</p>
      <Link
        href="/dashboard"
        className="inline-block bg-juris-burgundy text-juris-cream font-semibold px-6 py-3 rounded-sm hover:bg-juris-burgundy/90 transition-colors"
      >
        Go to Dashboard
      </Link>
    </section>
  );
}
