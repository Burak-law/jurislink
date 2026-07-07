import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ArticleReadPage({ params }) {
  const { slug } = params;
  const article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />
      <section className="px-6 md:px-16 pt-14 pb-24 max-w-3xl mx-auto">
        <Link href="/articles" className="text-juris-cream/50 hover:text-juris-cream text-sm mb-8 inline-block flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Tüm Makalelere Dön
        </Link>
        
        <h1 className="font-heading font-bold text-juris-cream text-3xl md:text-5xl mb-6 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-4 border-b border-juris-cream/10 pb-8 mb-10 text-sm text-juris-cream/60">
          <div>
            <span className="block font-bold text-juris-cream">{article.authorName}</span>
            <span>Yayınlanma: {new Date(article.createdAt).toLocaleDateString("tr-TR")}</span>
          </div>
        </div>
        
        <article className="prose prose-invert prose-lg max-w-none font-body text-juris-cream/90 leading-loose whitespace-pre-wrap">
          {article.content}
        </article>
      </section>
      <Footer />
    </>
  );
}
