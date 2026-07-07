"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ThreadReadPage({ params }) {
  const { slug } = params;
  const router = useRouter();
  
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    // In a real Server Component this would be fetched directly via Prisma.
    // For simplicity with client-side forms in the same file, we can fetch from an API
    // OR we can make this a Server Component and extract the ReplyForm to a Client Component.
    // Let's implement the data fetching here.
    fetch(`/api/forum/${slug}`)
      .then(res => res.json())
      .then(data => {
        if(data.thread) setThread(data.thread);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  async function handleReply(e) {
    e.preventDefault();
    if (!replyContent || !replyAuthor || !thread) return;
    
    setReplying(true);
    try {
      const res = await fetch("/api/forum/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: thread.id, content: replyContent, authorName: replyAuthor }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Append reply locally
        setThread(prev => ({
          ...prev,
          replies: [...prev.replies, data.reply]
        }));
        setReplyContent("");
      } else {
        alert("Bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Sunucuya ulaşılamadı.");
    } finally {
      setReplying(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-juris-navy text-juris-cream flex items-center justify-center">Yükleniyor...</div>;
  }

  if (!thread) {
    return <div className="min-h-screen bg-juris-navy text-juris-cream flex items-center justify-center">Başlık bulunamadı.</div>;
  }

  return (
    <>
      <Header />
      <section className="px-6 md:px-16 pt-14 pb-10 max-w-4xl mx-auto">
        <Link href="/forum" className="text-juris-cream/50 hover:text-juris-cream text-sm mb-6 inline-block flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Foruma Dön
        </Link>
        
        {/* Original Post */}
        <div className="bg-juris-navy p-8 rounded-sm border border-juris-cream/10 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-4 border-b border-juris-cream/10 pb-4">
             <div className="w-10 h-10 bg-juris-burgundy rounded-full flex items-center justify-center text-juris-cream font-bold text-lg">
                {thread.authorName.charAt(0).toUpperCase()}
             </div>
             <div>
               <h3 className="font-bold text-juris-cream">{thread.authorName}</h3>
               <p className="text-juris-cream/50 text-xs">{new Date(thread.createdAt).toLocaleDateString("tr-TR")} • {thread.category}</p>
             </div>
          </div>
          
          <h1 className="font-heading font-bold text-2xl text-juris-cream mb-4">{thread.title}</h1>
          <div className="text-juris-cream/90 font-body leading-loose whitespace-pre-wrap">
            {thread.content}
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-6 mb-12">
          <h3 className="font-heading font-bold text-xl text-juris-cream mb-4 border-b border-juris-cream/10 pb-2">
            Yanıtlar ({thread.replies.length})
          </h3>
          
          {thread.replies.map(reply => (
            <div key={reply.id} className="bg-juris-navy/50 p-6 rounded-sm border border-juris-cream/5 shadow-sm ml-0 md:ml-8">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 bg-juris-cream/20 rounded-full flex items-center justify-center text-juris-cream font-bold text-sm">
                    {reply.authorName.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h4 className="font-bold text-juris-cream text-sm">{reply.authorName}</h4>
                   <p className="text-juris-cream/50 text-xs">{new Date(reply.createdAt).toLocaleDateString("tr-TR")}</p>
                 </div>
              </div>
              <div className="text-juris-cream/80 text-sm font-body leading-relaxed whitespace-pre-wrap">
                {reply.content}
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <div className="bg-juris-navy p-6 rounded-sm border border-juris-cream/20 shadow-lg ml-0 md:ml-8">
          <h4 className="font-bold text-juris-cream mb-4">Cevap Yaz</h4>
          <form onSubmit={handleReply} className="space-y-4">
             <div>
                <input 
                  type="text" 
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder="Adınız veya Rumuzunuz"
                  className="w-full bg-black/20 border border-juris-cream/10 text-juris-cream px-4 py-2 text-sm rounded-sm focus:outline-none focus:border-juris-burgundy"
                  required
                />
             </div>
             <div>
                <textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Yanıtınızı buraya yazın..."
                  rows={4}
                  className="w-full bg-black/20 border border-juris-cream/10 text-juris-cream px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-juris-burgundy font-body"
                  required
                />
             </div>
             <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={replying}
                  className="bg-juris-burgundy text-juris-cream px-6 py-2 rounded-sm text-sm font-bold hover:bg-juris-burgundy/90 transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {replying ? "Gönderiliyor..." : "Gönder"}
                </button>
             </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
