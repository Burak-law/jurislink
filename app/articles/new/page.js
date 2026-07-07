"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !authorName || !content) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, authorName, content }),
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/articles/${data.article.slug}`);
      } else {
        alert("Bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="relative min-h-screen flex flex-col justify-between">


        <section className="relative z-10 px-6 md:px-16 pt-16 pb-24 max-w-4xl mx-auto w-full flex-grow">
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-juris-burgundy to-juris-navy rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-juris-cream/10 transform -rotate-3">
              <svg className="w-8 h-8 text-juris-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </div>
            <h1 className="font-heading font-bold text-juris-cream text-3xl md:text-4xl mb-3">
              Yeni Makale Yayınla
            </h1>
            <p className="text-juris-cream/60 max-w-lg mx-auto font-body text-sm md:text-base">
              Hukuki incelemelerinizi, doktriner çalışmalarınızı ve hukuki analizlerinizi toplulukla paylaşın.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-juris-cream/10 rounded-2xl p-8 md:p-10 shadow-2xl relative">
            {/* Glossy top highlight */}
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-juris-cream/20 to-transparent"></div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="block text-juris-cream/90 text-sm mb-2 font-bold tracking-wide">MAKALE BAŞLIĞI</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="İncelemenizin çarpıcı başlığı..."
                  className="w-full bg-black/20 border border-juris-cream/10 text-juris-cream px-5 py-4 rounded-xl focus:outline-none focus:border-juris-burgundy focus:ring-1 focus:ring-juris-burgundy transition-all placeholder-juris-cream/20 font-body"
                  required
                />
              </div>

              <div>
                <label className="block text-juris-cream/90 text-sm mb-2 font-bold tracking-wide">YAZAR ADI SOYADI</label>
                <input 
                  type="text" 
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Adınız Soyadınız veya Ünvanınız"
                  className="w-full bg-black/20 border border-juris-cream/10 text-juris-cream px-5 py-4 rounded-xl focus:outline-none focus:border-juris-burgundy focus:ring-1 focus:ring-juris-burgundy transition-all placeholder-juris-cream/20 font-body"
                  required
                />
              </div>

              <div>
                <label className="block text-juris-cream/90 text-sm mb-2 font-bold tracking-wide">İÇERİK (MAKALE METNİ)</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Makalenizi buraya yapıştırın veya yazmaya başlayın..."
                  rows={12}
                  className="w-full bg-black/20 border border-juris-cream/10 text-juris-cream px-5 py-4 rounded-xl focus:outline-none focus:border-juris-burgundy focus:ring-1 focus:ring-juris-burgundy transition-all placeholder-juris-cream/20 font-body resize-y"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-juris-cream/10">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="px-6 py-3.5 text-juris-cream/60 hover:text-juris-cream hover:bg-white/5 rounded-xl transition-all font-semibold"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-juris-burgundy to-amber-700 text-juris-cream px-10 py-3.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(114,47,55,0.4)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Yayınlanıyor...
                    </>
                  ) : "Yayınla"}
                </button>
              </div>
            </form>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
