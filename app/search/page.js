import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { getAllSearchData } from "@/lib/mockSearchData";

export const metadata = {
  title: "Search — JurisLink",
};

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q?.trim() || "";
  const typeParam = searchParams?.type?.trim() || "";
  const allSearchData = await getAllSearchData();
  
  let results = allSearchData;

  if (typeParam) {
    results = results.filter((item) => item.type === typeParam);
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q)
    );
  }

  const titles = {
    vocabulary: "Kelime Bilgisi",
    practice: "Pratik Çalışmalar"
  };

  const descriptions = {
    vocabulary: "Hukuki İngilizce terimleri ve kavramları keşfedin.",
    practice: "Hukuki senaryolar ve pratik çalışmalarla kendinizi test edin."
  };

  const pageTitle = typeParam ? titles[typeParam] || "JurisLink'te Ara" : "JurisLink'te Ara";
  const pageDesc = typeParam ? descriptions[typeParam] : "";

  return (
    <>
      <Header />

      <main className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="flex flex-col items-center px-6 md:px-16 mb-2">
          {!typeParam && (
            <Link
              href="/"
              className="inline-block text-juris-text/50 font-bold text-xs mb-8 hover:text-juris-accent transition-colors uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-200"
            >
              ← Ana Sayfaya Dön
            </Link>
          )}
          <div className={`bg-white border border-slate-200 rounded-3xl ${typeParam ? 'p-6 md:p-8' : 'p-6 md:p-10'} shadow-sm relative w-full max-w-4xl text-center`}>
            <h1 className="font-heading font-bold text-juris-text text-3xl md:text-4xl mb-3">
              {pageTitle}
            </h1>
            {pageDesc && (
              <p className="text-juris-text/70 text-base md:text-lg max-w-2xl mx-auto font-body font-medium">
                {pageDesc}
              </p>
            )}
            <div className={pageDesc ? "-mt-4" : "mt-0"}>
              <SearchBar defaultValue={query} autoFocus={!typeParam} showHint={false} />
            </div>
          </div>
        </div>

        <SearchResults results={results} query={query} />
      </main>

      <Footer />
    </>
  );
}
