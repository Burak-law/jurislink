"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus("error");
      setMessage("Please fill in every field.");
      return;
    }
    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New passwords don't match.");
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("saved");
      setMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="currentPassword" className="block text-juris-cream/70 text-sm mb-1.5">
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-3 bg-juris-cream text-juris-navy rounded-sm focus:outline-none focus:ring-2 focus:ring-juris-burgundy"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-juris-cream/70 text-sm mb-1.5">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          className="w-full px-4 py-3 bg-juris-cream text-juris-navy rounded-sm focus:outline-none focus:ring-2 focus:ring-juris-burgundy"
        />
      </div>

      {message && (
        <p className={status === "error" ? "text-juris-burgundy text-sm" : "text-juris-cream/60 text-sm"}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="self-start bg-juris-burgundy text-juris-cream font-semibold px-6 py-3 rounded-sm hover:bg-juris-burgundy/90 transition-colors disabled:opacity-60"
      >
        {status === "saving" ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
