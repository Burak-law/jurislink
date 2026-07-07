import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative px-6 md:px-16 pt-20 pb-16 text-center">
      <div className="relative">
        <p className="uppercase tracking-[0.35em] text-juris-accent text-xs md:text-sm font-bold mb-5">
          Yapay Zeka Destekli İçtihat ve Terminoloji Platformu
        </p>

        <h1 className="font-heading font-bold text-juris-text text-4xl md:text-6xl leading-tight max-w-3xl mx-auto">
          Hukukun Evrensel Diline
          <br className="hidden md:block" /> Hakim Olun.
        </h1>

        <p className="font-body text-juris-text/70 font-medium text-base md:text-lg max-w-xl mx-auto mt-6 leading-relaxed">
          Yargıtay emsal kararlarını inceleyin, Türkçe, İngilizce ve Latince hukuk terminolojisini tek bir platformda akademik titizlikle öğrenin.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full text-xs font-bold text-juris-text shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-4 h-4 text-juris-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            10.000+ İçtihat
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full text-xs font-bold text-juris-text shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Sürekli Güncel
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full text-xs font-bold text-juris-text shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Gelişmiş Hukuk Sözlüğü
          </div>
        </div>

        <SearchBar />
      </div>
    </section>
  );
}
