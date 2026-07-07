import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllTerms, getTermBySlug } from "@/lib/mockTerms";
import { getCaseBySlug } from "@/lib/mockCases";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const allTerms = await getAllTerms();
  return allTerms.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const term = await getTermBySlug(params.slug);
  if (!term) return { title: "Term Not Found — JurisLink" };

  return {
    title: `${term.term} — JurisLink`,
    description: `Legal definition and usage of the term: ${term.term}. Area of law: ${term.areaOfLaw}.`,
    openGraph: {
      title: `${term.term} — JurisLink`,
      description: `Learn the legal definition and context of ${term.term}.`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: term.term,
      description: `Legal definition: ${term.term}`,
    },
  };
}

async function recordTermLearned(term) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  const existing = await prisma.activity.findFirst({
    where: { userId: session.user.id, type: "term_learned", targetSlug: term.slug },
  });
  if (existing) return;

  await prisma.activity.create({
    data: {
      userId: session.user.id,
      type: "term_learned",
      targetTitle: term.term,
      targetSlug: term.slug,
    },
  });
}

export default async function TermDetailPage({ params }) {
  const term = await getTermBySlug(params.slug);
  if (!term) notFound();

  await recordTermLearned(term);

  const allTerms = await getAllTerms();
  const related = allTerms.filter((t) => term.relatedTerms.includes(t.slug));
  const relatedCase = term.relatedCase ? await getCaseBySlug(term.relatedCase) : null;

  return (
    <>
      <Header />

      <article className="px-6 md:px-16 pt-10 pb-24 max-w-2xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Search", href: "/search" },
            { label: term.term },
          ]}
        />

        <header className="bg-juris-cream text-juris-navy rounded-sm border-t-4 border-juris-burgundy p-8 md:p-10 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-juris-burgundy font-bold">
            Vocabulary
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mt-3 mb-2">
            {term.term}
          </h1>
          {(term.englishTranslation || term.latinEquivalent) && (
            <div className="flex flex-col gap-1 mt-3 mb-4">
              {term.englishTranslation && (
                <p className="text-sm font-medium text-blue-400">
                  <span className="text-juris-navy/50 mr-2">EN:</span> {term.englishTranslation}
                </p>
              )}
              {term.latinEquivalent && (
                <p className="text-sm font-medium italic text-amber-500">
                  <span className="text-juris-navy/50 mr-2 not-italic">LA:</span> {term.latinEquivalent}
                </p>
              )}
            </div>
          )}
          <p className="text-sm text-juris-navy/60">{term.areaOfLaw} · Term</p>
        </header>

        <section className="mb-10">
          <h2 className="font-heading font-bold text-xl text-juris-cream mb-3">Definition</h2>
          <p className="text-juris-cream/70 leading-relaxed">{term.definition}</p>
        </section>

        <section className="bg-juris-burgundy/10 border border-juris-burgundy/30 rounded-sm p-6 md:p-8 mb-10">
          <h2 className="font-heading font-bold text-lg text-juris-cream mb-3">
            In Context
          </h2>
          <p className="text-juris-cream/80 leading-relaxed italic">{term.usage}</p>
        </section>

        {relatedCase && (
          <section className="mb-10">
            <h2 className="font-heading font-bold text-lg text-juris-cream mb-4">
              Seen In
            </h2>
            <Link
              href={`/case/${relatedCase.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-juris-cream border border-juris-cream/20 rounded-sm px-4 py-2 hover:border-juris-burgundy hover:text-juris-burgundy transition-colors"
            >
              {relatedCase.title} →
            </Link>
          </section>
        )}

        {related.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-lg text-juris-cream mb-4">
              Related Terms
            </h2>
            <div className="flex flex-wrap gap-3">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  href={`/term/${t.slug}`}
                  className="text-sm font-medium text-juris-cream border border-juris-cream/20 rounded-sm px-4 py-2 hover:border-juris-burgundy hover:text-juris-burgundy transition-colors"
                >
                  {t.term} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </>
  );
}
