"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(e) {
    e.preventDefault();
    if (!password) {
      setError("Please enter your password to confirm.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch("/api/profile/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setIsDeleting(false);
        return;
      }

      signOut({ callbackUrl: "/" });
    } catch {
      setError("Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="border border-juris-burgundy/30 rounded-sm p-6">
      <h2 className="font-heading font-bold text-lg text-juris-burgundy mb-2">
        Danger Zone
      </h2>
      <p className="text-juris-cream/60 text-sm mb-4">
        Deleting your account permanently removes your profile, essay drafts,
        and progress history. This can&apos;t be undone.
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="text-sm font-semibold text-juris-burgundy hover:text-juris-burgundy/70 transition-colors"
        >
          Delete my account
        </button>
      ) : (
        <form onSubmit={handleDelete} className="flex flex-col gap-3 max-w-sm">
          <label htmlFor="deletePassword" className="text-juris-cream/70 text-sm">
            Enter your password to confirm
          </label>
          <input
            id="deletePassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-juris-cream text-juris-navy rounded-sm focus:outline-none focus:ring-2 focus:ring-juris-burgundy"
          />
          {error && <p className="text-juris-burgundy text-sm">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isDeleting}
              className="bg-juris-burgundy text-juris-cream font-semibold px-5 py-2.5 rounded-sm hover:bg-juris-burgundy/90 transition-colors disabled:opacity-60"
            >
              {isDeleting ? "Deleting…" : "Permanently Delete"}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setPassword("");
                setError("");
              }}
              className="text-juris-cream/60 text-sm hover:text-juris-cream transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
