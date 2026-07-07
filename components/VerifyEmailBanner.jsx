"use client";

import { useState } from "react";

export default function VerifyEmailBanner() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [message, setMessage] = useState("");

  async function handleResend() {
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("sent");
      setMessage(data.message || "Verification email sent.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="bg-juris-burgundy/10 border border-juris-burgundy/30 rounded-sm px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-juris-cream/80 text-sm">
        {status === "sent" || status === "error"
          ? message
          : "Please verify your email address to unlock all features."}
      </p>
      {status !== "sent" && (
        <button
          onClick={handleResend}
          disabled={status === "sending"}
          className="shrink-0 text-sm font-semibold text-juris-burgundy hover:text-juris-burgundy/70 transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Resend verification email"}
        </button>
      )}
    </div>
  );
}
