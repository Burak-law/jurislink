"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewThreadPage() {
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("Genel Hukuk");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !authorName || !content) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, authorName, content, category }),
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/forum/${data.thread.slug}`);
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
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-juris-burgundy to-juris-navy rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-juris-cream/10 transform rotate-3">
              <svg className="w-8 h-8 text-juris-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            </div>
            <h1 className="font-heading font-bold text-juris-cream text-3xl md:text-4xl mb-3">
              Yeni Tartışma Başlat
            </h1>
            <p className="text-juris-cream/60 max-w-lg mx-auto font-body text-sm md:text-base">
              Meslektaşlarınızla fikir alışverişi yapmak veya hukuki bir düğümü çözmek için topluluğa yeni bir konu sunun.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-juris-cream/10 rounded-2xl p-8 md:p-10 shadow-2xl relative">
            {/* Glossy top highlight */}
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-juris-cream/20 to-transparent"></div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="block text-juris-cream/90 text-sm mb-2 font-bold tracking-wide">BAŞLIK</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tartışmak istediğiniz konunun özeti..."
                  className="w-full bg-black/20 border border-juris-cream/10 text-juris-cream px-5 py-4 rounded-xl focus:outline-none focus:border-juris-burgundy focus:ring-1 focus:ring-juris-burgundy transition-all placeholder-juris-cream/20 font-body"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div>
                  <label className="block text-juris-cream/90 text-sm mb-2 font-bold tracking-wide">YAZAR / RUMUZ</label>
                  <input 
                    type="text" 
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="w-full bg-black/20 border border-juris-cream/10 text-juris-cream px-5 py-4 rounded-xl focus:outline-none focus:border-juris-burgundy focus:ring-1 focus:ring-juris-burgundy transition-all placeholder-juris-cream/20 font-body"
                    required
                  />
                </div>
                <div>
                  <label className="block text-juris-cream/90 text-sm mb-2 font-bold tracking-wide">KATEGORİ</label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black/20 border border-juris-cream/10 text-juris-cream px-5 py-4 rounded-xl focus:outline-none focus:border-juris-burgundy focus:ring-1 focus:ring-juris-burgundy transition-all appearance-none font-body cursor-pointer"
                    >
                      <option value="Genel Hukuk" className="bg-juris-navy text-juris-cream">Genel Hukuk</option>
                      <option value="İş Hukuku" className="bg-juris-navy text-juris-cream">İş Hukuku</option>
                      <option value="Ceza Hukuku" className="bg-juris-navy text-juris-cream">Ceza Hukuku</option>
                      <option value="Medeni Hukuk" className="bg-juris-navy text-juris-cream">Medeni Hukuk</option>
                      <option value="Ticaret Hukuku" className="bg-juris-navy text-juris-cream">Ticaret Hukuku</option>
                      <option value="İdare Hukuku" className="bg-juris-navy text-juris-cream">İdare Hukuku</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-juris-cream/50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-juris-cream/90 text-sm mb-2 font-bold tracking-wide">MESAJINIZ</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Düşüncelerinizi buraya yazın..."
                  rows={8}
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
                      Açılıyor...
                    </>
                  ) : "Başlığı Yayınla"}
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
