"use client";

import Link from "next/link";

const defaultCase = {
  slug: "donoghue-v-stevenson",
  docketNo: "07/2026",
  title: "Donoghue v. Stevenson",
  citation: "[1932] AC 562 · House of Lords, United Kingdom",
  summary:
    "Çürümüş bir salyangoz, bir şişe zencefilli gazoz ve modern ihmal (negligence) hukukunu doğuran bir karar. Bu dava, özen yükümlülüğü (duty of care) hakkındaki her argümanın ve müfredatın temelini oluşturmaya devam ediyor.",
  areaOfLaw: "Haksız Fiil · İhmal (Tort · Negligence)",
  keyConcept: "Özen Yükümlülüğü (Duty of Care)",
  citedCount: "1,200+ kez",
};

export default function CaseOfWeekCard({ caseData = defaultCase }) {
  const {
    slug,
    docketNo,
    title,
    citation,
    summary,
    areaOfLaw,
    keyConcept,
    citedCount,
  } = caseData;

  return (
    <section className="px-6 md:px-16 pb-24 flex justify-center relative z-10">
      <div className="relative max-w-2xl w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8 md:p-10 text-juris-text">
        {/* Seal badge */}
        <div className="seal absolute -top-6 right-8 w-14 h-14 rounded-full bg-juris-accent border-4 border-white shadow-lg flex items-center justify-center">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v18M5 7l-3 6a3 3 0 0 0 6 0l-3-6zM19 7l-3 6a3 3 0 0 0 6 0l-3-6zM5 7h14M8 21h8" />
          </svg>
        </div>

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <span className="text-xs uppercase tracking-[0.25em] text-juris-accent font-bold">
            Haftanın Davası
          </span>
          <span className="text-xs text-juris-text/50 font-bold">Kayıt No. {docketNo}</span>
        </div>

        <h2 className="font-heading font-bold text-2xl md:text-3xl mb-1">{title}</h2>
        <p className="text-sm text-juris-text/60 mb-6 font-semibold">{citation}</p>

        <p className="text-juris-text/80 leading-relaxed mb-8">{summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-juris-text/40 text-[10px] font-bold uppercase tracking-widest mb-1">
              Hukuk Alanı
            </p>
            <p className="font-semibold text-juris-text/90">{areaOfLaw}</p>
          </div>
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-juris-text/40 text-[10px] font-bold uppercase tracking-widest mb-1">
              Anahtar Kavram
            </p>
            <p className="font-semibold text-juris-text/90">{keyConcept}</p>
          </div>
          <div className="border-l-2 border-slate-200 pl-3">
            <p className="text-juris-text/40 text-[10px] font-bold uppercase tracking-widest mb-1">
              Atıf Sayısı
            </p>
            <p className="font-semibold text-juris-text/90">{citedCount}</p>
          </div>
        </div>

        <Link
          href={`/case/${slug}`}
          className="inline-block bg-slate-100 border border-slate-200 text-juris-text font-bold px-8 py-3.5 rounded-xl hover:bg-juris-accent hover:text-white transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-juris-accent"
        >
          Tam Analizi Oku →
        </Link>
      </div>
    </section>
  );
}
