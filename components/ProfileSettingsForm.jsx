"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfileSettingsForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setStatus("error");
      setMessage("Name can't be empty.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("saving");
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      await update({ name: data.name, email: data.email });

      setStatus("saved");
      setMessage(
        data.emailChanged
          ? "Saved. Since you changed your email, please verify the new address — we've sent a link."
          : "Saved."
      );
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-juris-cream/70 text-sm mb-1.5">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-juris-cream text-juris-navy rounded-sm focus:outline-none focus:ring-2 focus:ring-juris-burgundy"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-juris-cream/70 text-sm mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        {status === "saving" ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
