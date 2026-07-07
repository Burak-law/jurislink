"use client";
import { useState } from "react";

export default function YargitayCard({ decision }) {
  const [showFullText, setShowFullText] = useState(false);

  const {
    slug,
    esasNo,
    kararNo,
    court,
    date,
    areaOfLaw,
    summary,
    principle,
    fullText,
    sourceUrl,
  } = decision;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-juris-accent/30 p-6 md:p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-juris-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-slate-100">
        <div>
          <span className="inline-block bg-juris-accent/10 text-juris-accent px-2 py-1 text-xs font-semibold rounded-sm mb-2 uppercase tracking-widest">
            {areaOfLaw}
          </span>
          <h3 className="font-heading font-bold text-xl md:text-2xl text-juris-text leading-tight">
            {court}
          </h3>
        </div>
        <div className="text-left md:text-right mt-2 md:mt-0 text-sm text-juris-text/60">
          <p>E: {esasNo}</p>
          <p>K: {kararNo}</p>
          <p>{date}</p>
        </div>
      </div>

      <div className="mb-6 relative">
        <h4 className="text-xs uppercase tracking-[0.2em] text-juris-accent mb-2 font-bold">
          Karar Özeti
        </h4>
        <p className="text-juris-text/80 text-sm leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-sm border border-slate-100 relative mb-4">
        <h4 className="text-xs uppercase tracking-[0.2em] text-juris-text/50 mb-2 font-bold">
          Emsal Hüküm (Principle)
        </h4>
        <p className="text-juris-text text-sm font-medium leading-relaxed italic">
          &quot;{principle}&quot;
        </p>
      </div>

      {(fullText || sourceUrl) && (
        <div className="mt-4 pt-4 border-t border-slate-100 relative z-10">
          <div className="flex justify-between items-center">
            {fullText && (
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-juris-accent hover:text-juris-accent/80 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                {showFullText ? "Tam Metni Gizle" : "Tam Metni Oku"}
                <svg className={`w-4 h-4 transform transition-transform ${showFullText ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            )}
            
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-juris-cream/50 hover:text-juris-cream text-sm flex items-center gap-1 transition-colors">
                Resmi Kaynak <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            )}
          </div>
          
          {showFullText && fullText && (
            <div className="mt-4 p-4 bg-black/20 rounded-sm text-sm text-juris-cream/80 leading-relaxed whitespace-pre-wrap font-body">
              {fullText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
