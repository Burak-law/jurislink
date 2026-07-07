import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import YargitayCard from "@/components/YargitayCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Yargıtay Kararları — JurisLink",
};

export default async function YargitayPage({ searchParams }) {
  const query = searchParams?.q?.trim() || "";
  
  let decisions = [];

  if (query) {
    const q = query.toLowerCase();
    const allDecisions = await prisma.yargitayDecision.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    decisions = allDecisions.filter(
      (d) => 
        d.summary.toLowerCase().includes(q) ||
        d.areaOfLaw.toLowerCase().includes(q) ||
        d.court.toLowerCase().includes(q) ||
        d.principle.toLowerCase().includes(q) ||
        d.esasNo.toLowerCase().includes(q) ||
        d.kararNo.toLowerCase().includes(q)
    );
  } else {
    decisions = await prisma.yargitayDecision.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  return (
    <>
      <Header />

      <section className="relative z-10 px-6 md:px-16 pt-16 pb-12 max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-juris-text/40 mb-6">
          <Link href="/" className="hover:text-juris-accent transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-juris-text font-bold">Yargıtay Kararları</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm relative">
          <h1 className="font-heading font-bold text-juris-text text-3xl md:text-4xl mb-4 drop-shadow-sm">
            Yargıtay Emsal Kararları
          </h1>
          <p className="text-juris-text/70 text-base md:text-lg mb-8 max-w-2xl mx-auto font-body font-medium">
            Türk hukukunun temelini oluşturan Yargıtay İçtihatları. İş, ceza, borçlar veya diğer alanlardaki emsal kararları arayın ve inceleyin.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar defaultValue={query} autoFocus showHint={false} actionPath="/yargitay" />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 pb-24 max-w-4xl mx-auto">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-juris-text font-heading">
            {query ? `"${query}" için sonuçlar (${decisions.length})` : "Son Eklenen Kararlar"}
          </h2>
        </div>

        {decisions.length > 0 ? (
          <div className="flex flex-col gap-6">
            {decisions.map((decision) => (
              <YargitayCard key={decision.id} decision={decision} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-juris-text/50 font-medium mb-4">Aramanızla eşleşen bir karar bulunamadı.</p>
            <Link href="/yargitay" className="text-juris-accent hover:underline text-sm font-bold">
              Tüm kararları görüntüle
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
