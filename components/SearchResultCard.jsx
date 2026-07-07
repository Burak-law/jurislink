import Link from "next/link";

const typeLabels = {
  yargitay: "Yargıtay",
  vocabulary: "Sözlük",
  practice: "Pratik",
};

const typeBadgeClasses = {
  yargitay: "bg-juris-accent/10 text-juris-accent border border-juris-accent/20",
  vocabulary: "bg-slate-100 text-juris-text border border-slate-200",
  practice: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
};

const typeBasePath = {
  vocabulary: "/term",
  practice: "/practice",
};

export default function SearchResultCard({ result }) {
  const { type, title, snippet, meta, slug } = result;
  
  let href = null;
  if (type === "yargitay" && slug) {
    href = `/yargitay?q=${slug}`;
  } else if (slug && typeBasePath[type]) {
    href = `${typeBasePath[type]}/${slug}`;
  }

  return (
    <article className="group relative bg-white rounded-xl border border-slate-200 hover:border-juris-accent/30 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-juris-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-20"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm ${typeBadgeClasses[type]}`}>
            {typeLabels[type]}
          </span>
          {meta && <span className="text-xs text-juris-text/50 font-medium">{meta}</span>}
        </div>
        
        <h2 className="font-heading font-bold text-xl md:text-2xl text-juris-text mb-3 leading-tight group-hover:text-juris-accent transition-colors">
          {href ? (
            <Link href={href} className="before:absolute before:inset-0 z-10">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        
        <p className="text-sm text-juris-text/70 leading-relaxed line-clamp-3">
          {snippet}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-juris-accent text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
          <span>İncele</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </div>
      </div>
    </article>
  );
}
