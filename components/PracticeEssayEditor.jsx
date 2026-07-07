"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

const SAVE_DEBOUNCE_MS = 1000;

export default function PracticeEssayEditor({ slug }) {
  const { status } = useSession();
  const [text, setText] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const debounceRef = useRef(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function handleEvaluate() {
    if (wordCount < 10) {
      alert("Lütfen değerlendirme için daha uzun bir metin yazın.");
      return;
    }
    setEvaluating(true);
    setEvaluation(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practiceSlug: slug, userEssay: text })
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setEvaluation(data);
      } else {
        alert(data.error || data.feedback || "Değerlendirme sırasında bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Yapay zeka servisine ulaşılamadı.");
    } finally {
      setEvaluating(false);
    }
  }

  // Load any existing draft once we know the user is logged in.
  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;

    setSaveState("loading");
    fetch(`/api/essay-draft?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.content) setText(data.content);
        setSaveState("idle");
      })
      .catch(() => {
        if (!cancelled) setSaveState("idle");
      });

    return () => {
      cancelled = true;
    };
  }, [slug, status]);

  function handleChange(e) {
    const value = e.target.value;
    setText(value);

    if (status !== "authenticated") return;

    setSaveState("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await fetch("/api/essay-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ practiceSlug: slug, content: value }),
        });
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, SAVE_DEBOUNCE_MS);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const statusLabel = {
    idle: "\u00A0",
    loading: "Loading your draft…",
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save — check your connection.",
  }[saveState];

  return (
    <section className="mb-10">
      <h2 className="font-heading font-bold text-xl text-juris-cream mb-3">
        Draft Your Answer
      </h2>
      <textarea
        value={text}
        onChange={handleChange}
        rows={10}
        placeholder="Start writing your IRAC response here…"
        className="w-full bg-juris-cream text-juris-navy placeholder-juris-navy/40 rounded-sm p-4 font-body leading-relaxed focus:outline-none focus:ring-2 focus:ring-juris-burgundy"
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-juris-cream/40 text-xs">{wordCount} kelime</p>
        <p className="text-juris-cream/40 text-xs">
          {status === "authenticated"
            ? statusLabel
            : "Otomatik kaydetmek için giriş yapın."}
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleEvaluate}
          disabled={evaluating || wordCount < 10}
          className="bg-juris-burgundy text-juris-cream px-8 py-3 rounded-sm font-bold shadow-lg hover:bg-juris-burgundy/90 transition-transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
        >
          {evaluating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Değerlendiriliyor...
            </>
          ) : (
            "Yapay Zeka ile Değerlendir"
          )}
        </button>
      </div>

      {evaluation && (
        <div className="mt-8 bg-juris-navy border border-juris-burgundy p-6 rounded-sm shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-juris-burgundy"></div>
          <h3 className="text-xl font-heading font-bold text-juris-cream mb-4 flex items-center gap-3">
            <span className="bg-juris-burgundy text-juris-cream px-3 py-1 rounded-sm text-sm">
              Skor: %{evaluation.score}
            </span>
            Yargıtay Emsaline Göre Değerlendirme
          </h3>
          <p className="text-juris-cream/80 leading-relaxed font-body whitespace-pre-wrap">
            {evaluation.feedback}
          </p>
        </div>
      )}
    </section>
  );
}
