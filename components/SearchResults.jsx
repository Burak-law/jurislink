"use client";

import { useState } from "react";
import SearchResultCard from "./SearchResultCard";

const tabs = [
  { key: "all", label: "All" },
  { key: "case", label: "Cases" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "practice", label: "Practice" },
];

export default function SearchResults({ results, query }) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? results
      : results.filter((r) => r.type === activeTab);

  return (
    <section className="px-6 md:px-16 pb-24 max-w-3xl mx-auto">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <p className="text-juris-text/60 font-semibold text-sm">
          {query
            ? results.length > 0
              ? `"${query}" için ${results.length} sonuç bulundu`
              : `"${query}" için sonuç bulunamadı`
            : "Tüm kaynaklara göz atın veya yukarıdan arama yapın."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full transition-colors ${
              activeTab === tab.key
                ? "bg-juris-accent text-white shadow-sm"
                : "bg-slate-100 text-juris-text/70 border border-slate-200 hover:text-juris-accent hover:border-juris-accent/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((result) => (
            <div key={result.id}>
              <SearchResultCard result={result} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-10 text-center">
          <p className="text-juris-text font-heading font-bold text-lg mb-2">
            Burada henüz bir şey yok.
          </p>
          <p className="text-juris-text/50 font-medium text-sm">
            Farklı bir terim deneyin veya yukarıdan başka bir kategori seçin.
          </p>
        </div>
      )}
    </section>
  );
}
