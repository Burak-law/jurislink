"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleIngest = async () => {
    if (!password) {
      setError("Lütfen Admin şifresini girin.");
      return;
    }
    if (!text || text.length < 50) {
      setError("Lütfen geçerli bir karar metni yapıştırın.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, text })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setMessage(data.message);
      setText(""); // Başarılıysa kutuyu temizle
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="relative z-10 min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-heading font-bold text-juris-cream drop-shadow-md">
              JurisLink Yönetim Paneli
            </h1>
            <p className="text-juris-cream/70 mt-2">
              Yargıtay Kararlarını Yapay Zeka (AI) İle Sisteme Yükle
            </p>
          </div>

          <div className="bg-white/5 border border-juris-cream/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative">
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-juris-cream/20 to-transparent"></div>
            {message && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                <span>✅</span> {message}
              </div>
            )}
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                <span>❌</span> {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-juris-cream font-semibold mb-2">Admin Şifresi</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifreyi giriniz (juris2026)"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-juris-cream focus:outline-none focus:border-juris-burgundy transition-colors"
              />
            </div>

            <div className="mb-6">
              <label className="block text-juris-cream font-semibold mb-2">Yargıtay Karar Metni</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Kazancı, Lexpera veya UYAP'tan kopyaladığınız kararın tam metnini buraya yapıştırın..."
                className="w-full h-80 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-juris-cream focus:outline-none focus:border-juris-burgundy transition-colors font-mono text-sm leading-relaxed resize-y"
              />
            </div>

            <button 
              onClick={handleIngest}
              disabled={loading}
              className="w-full bg-juris-burgundy hover:bg-red-900 text-white font-bold py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Yapay Zeka Okuyor ve İçerik Üretiyor... Lütfen Bekleyin...
                </>
              ) : (
                <>
                  <span>🤖</span> Yapay Zeka İle Sisteme Yükle
                </>
              )}
            </button>
            <p className="text-juris-cream/40 text-xs text-center mt-4">
              Not: Bu işlem kararın uzunluğuna göre 10-30 saniye sürebilir. Lütfen işlem bitene kadar sayfayı kapatmayın.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
