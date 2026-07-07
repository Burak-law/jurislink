import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Forum — JurisLink",
};

// Helper function to map category to color palettes
function getCategoryStyles(category) {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("içtihat") || cat.includes("karar")) {
    return "bg-juris-burgundy/10 text-juris-burgundy border-juris-burgundy/30";
  }
  if (cat.includes("soru") || cat.includes("yardım")) {
    return "bg-blue-500/10 text-blue-400 border-blue-500/30";
  }
  if (cat.includes("akademik") || cat.includes("doktrin")) {
    return "bg-amber-500/10 text-amber-500 border-amber-500/30";
  }
  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
}

export default async function ForumPage() {
  const threads = await prisma.forumThread.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { replies: true }
      }
    }
  });

  return (
    <>
      <Header />
      
      <div className="relative min-h-screen flex flex-col justify-between">


        <section className="relative z-10 px-6 md:px-16 pt-12 pb-12 max-w-5xl mx-auto w-full text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-juris-text/40 mb-6">
            <Link href="/" className="hover:text-juris-accent transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-juris-text font-bold">Forum</span>
          </div>
          <div className="mx-auto w-16 h-16 bg-juris-accent rounded-2xl flex items-center justify-center mb-6 shadow-md border border-slate-200 transform -rotate-3 z-10 relative">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
          </div>
          <h1 className="font-heading font-bold text-juris-accent text-4xl md:text-5xl mb-4 leading-tight drop-shadow-sm">
            Hukuk Topluluğu & Forum
          </h1>
          <p className="text-juris-text/80 font-medium text-base md:text-lg mb-8 max-w-2xl mx-auto font-body">
            İçtihatları tartışın, hukuki düğümleri çözün ve meslektaşlarınızla profesyonel bir zemin üzerinde fikir alışverişinde bulunun.
          </p>
          <Link 
            href="/forum/new" 
            className="inline-block bg-slate-100 border border-slate-200 text-juris-text px-8 py-3.5 rounded-sm font-bold tracking-wide hover:bg-white hover:text-juris-accent transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            Yeni Başlık Aç
          </Link>
        </section>

        <section className="relative z-10 px-6 md:px-16 pb-24 max-w-5xl mx-auto w-full flex-grow">
          {/* Container wrapper for the list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm relative flex flex-col gap-5">
            {threads.length > 0 ? (
              threads.map((thread) => {
                const catStyles = getCategoryStyles(thread.category);
                const authorInitial = thread.authorName ? thread.authorName.charAt(0).toUpperCase() : "?";
                
                return (
                  <Link 
                    key={thread.id} 
                    href={`/forum/${thread.slug}`}
                    className="group relative bg-slate-50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:border-juris-accent/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col sm:flex-row justify-between items-start sm:items-center overflow-hidden"
                  >
                    {/* Hover Left Accent Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-juris-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    
                    <div className="flex items-start gap-5 pl-2">
                      {/* Author Avatar */}
                      <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-slate-200 items-center justify-center border border-slate-300 text-juris-accent font-heading font-bold shadow-inner">
                        {authorInitial}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${catStyles}`}>
                            {thread.category || "Genel"}
                          </span>
                          <span className="text-juris-text/50 text-xs font-semibold">
                            {new Date(thread.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <h2 className="font-heading font-bold text-xl text-juris-accent mb-1 group-hover:text-juris-accent/80 transition-colors">
                          {thread.title}
                        </h2>
                        <p className="text-juris-text/60 text-sm flex items-center gap-2">
                          <span className="sm:hidden w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-juris-accent font-bold">
                            {authorInitial}
                          </span>
                          <span className="font-bold text-juris-text/80">{thread.authorName}</span> tarafından başlatıldı
                        </p>
                      </div>
                    </div>
                    
                    {/* Reply Counter Badge */}
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                      <div className="flex flex-col items-center justify-center min-w-[70px] py-2 px-3 bg-white rounded-lg border border-slate-200 group-hover:border-juris-accent/30 transition-colors">
                        <span className="text-juris-accent font-bold text-lg leading-none mb-1">
                          {thread._count.replies}
                        </span>
                        <span className="text-juris-text/50 text-[10px] uppercase tracking-wider font-bold">
                          Yanıt
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-20 px-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3 className="text-xl font-heading font-bold text-juris-text mb-2">Henüz Tartışma Yok</h3>
                <p className="text-juris-text/60 font-medium max-w-md mx-auto">Forum bölümü şu an sessiz. Aklınıza takılan hukuki bir soruyu veya bir içtihadı paylaşarak ilk adımı siz atın.</p>
              </div>
            )}
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}
