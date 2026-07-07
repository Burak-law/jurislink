import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Makaleler — JurisLink",
};

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <Header />
      
      <div className="relative min-h-screen flex flex-col justify-between">


        <section className="relative z-10 px-6 md:px-16 pt-12 pb-12 max-w-5xl mx-auto w-full text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-juris-text/40 mb-6">
            <Link href="/" className="hover:text-juris-accent transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-juris-text font-bold">Makaleler</span>
          </div>
          <div className="mx-auto w-16 h-16 bg-juris-accent rounded-2xl flex items-center justify-center mb-6 shadow-md border border-slate-200 transform -rotate-3 z-10 relative">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>
          <h1 className="font-heading font-bold text-juris-accent text-4xl md:text-5xl mb-4 leading-tight drop-shadow-sm">
            Hukuki Makaleler & İncelemeler
          </h1>
          <p className="text-juris-text/80 font-medium text-base md:text-lg mb-8 max-w-2xl mx-auto font-body">
            Akademisyenler, avukatlar ve hukuk öğrencileri tarafından kaleme alınan güncel hukuki incelemeler ve doktriner tartışmalar.
          </p>
          <Link 
            href="/articles/new" 
            className="inline-block bg-slate-100 border border-slate-200 text-juris-text px-8 py-3.5 rounded-sm font-bold tracking-wide hover:bg-white hover:text-juris-accent transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            Yeni Makale Yaz
          </Link>
        </section>

        {/* Articles Grid inside a glassmorphic container for cohesion */}
        <section className="relative z-10 px-6 md:px-16 pb-24 max-w-6xl mx-auto w-full flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col bg-white p-7 rounded-2xl border border-slate-200 hover:border-juris-accent/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Decorative glowing accent on hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-juris-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner">
                        <span className="text-juris-accent font-heading font-bold text-lg">
                          {article.authorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-juris-text text-sm font-bold leading-none">{article.authorName}</p>
                        <p className="text-juris-text/50 font-semibold text-[11px] mt-1 uppercase tracking-wider">
                          {new Date(article.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    
                    <h2 className="font-heading font-bold text-xl text-juris-text mb-3 group-hover:text-juris-accent transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-juris-text/70 font-medium text-sm line-clamp-3 font-body leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-juris-accent group-hover:text-juris-accent/80 transition-colors">
                    <span>Makaleyi Oku</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 px-6 bg-white border border-dashed border-slate-200 rounded-2xl shadow-sm">
                <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-juris-text mb-2">Henüz Makale Yok</h3>
                <p className="text-juris-text/60 font-medium max-w-md mx-auto">JurisLink kütüphanesi henüz boş. İlk makaleyi yazarak topluluğa öncülük edebilirsiniz.</p>
              </div>
            )}
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}
