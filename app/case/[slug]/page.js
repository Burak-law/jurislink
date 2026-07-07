import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllCases, getCaseBySlug } from "@/lib/mockCases";
import { getAllTerms } from "@/lib/mockTerms";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const allCases = await getAllCases();
  return allCases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const caseItem = await getCaseBySlug(params.slug);
  if (!caseItem) return { title: "Case Not Found — JurisLink" };

  return {
    title: `${caseItem.title} — JurisLink`,
    description: `Learn about the legal case ${caseItem.title} (${caseItem.year}). Area of law: ${caseItem.areaOfLaw}.`,
    openGraph: {
      title: `${caseItem.title} — JurisLink`,
      description: `Case summary, facts, and legal principles for ${caseItem.title}.`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: caseItem.title,
      description: `Case summary: ${caseItem.title}`,
    },
  };
}

// Logs a "case_read" activity the first time a logged-in user visits this
// case. Silently does nothing for logged-out visitors.
async function recordCaseRead(caseItem) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  const existing = await prisma.activity.findFirst({
    where: { userId: session.user.id, type: "case_read", targetSlug: caseItem.slug },
  });
  if (existing) return;

  await prisma.activity.create({
    data: {
      userId: session.user.id,
      type: "case_read",
      targetTitle: caseItem.title,
      targetSlug: caseItem.slug,
    },
  });
}

export default async function CaseDetailPage({ params }) {
  const caseItem = await getCaseBySlug(params.slug);
  if (!caseItem) notFound();

  await recordCaseRead(caseItem);

  const allTerms = await getAllTerms();
  const related = allTerms.filter((t) => caseItem.relatedTerms.includes(t.slug));

  return (
    <>
      <Header />

      <article className="px-6 md:px-16 pt-10 pb-24 max-w-3xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Search", href: "/search" },
            { label: caseItem.title },
          ]}
        />

        {/* Case header, styled like the docket motif from the homepage card */}
        <header className="bg-juris-cream text-juris-navy rounded-sm border-t-4 border-juris-burgundy p-8 md:p-10 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-juris-burgundy font-bold">
            Case Law
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mt-3 mb-2">
            {caseItem.title}
          </h1>
          <p className="text-sm text-juris-navy/60 mb-6">
            {caseItem.citation} · {caseItem.court}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="border-l-2 border-juris-burgundy/40 pl-3">
              <p className="text-juris-navy/40 text-xs uppercase tracking-wide mb-1">Year</p>
              <p className="font-medium">{caseItem.year}</p>
            </div>
            <div className="border-l-2 border-juris-burgundy/40 pl-3">
              <p className="text-juris-navy/40 text-xs uppercase tracking-wide mb-1">
                Area of Law
              </p>
              <p className="font-medium">{caseItem.areaOfLaw}</p>
            </div>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="font-heading font-bold text-xl text-juris-cream mb-3">Facts</h2>
          <p className="text-juris-cream/70 leading-relaxed">{caseItem.facts}</p>
        </section>

        <section className="mb-10">
          <h2 className="font-heading font-bold text-xl text-juris-cream mb-3">Held</h2>
          <p className="text-juris-cream/70 leading-relaxed">{caseItem.held}</p>
        </section>

        {/* Ratio decidendi callout */}
        <section className="bg-juris-burgundy/10 border border-juris-burgundy/30 rounded-sm p-6 md:p-8 mb-10">
          <h2 className="font-heading font-bold text-lg text-juris-cream mb-3">
            Legal Principle (Ratio Decidendi)
          </h2>
          <p className="text-juris-cream/80 leading-relaxed">{caseItem.principle}</p>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-lg text-juris-cream mb-4">
              Related Terms
            </h2>
            <div className="flex flex-wrap gap-3">
              {related.map((term) => (
                <Link
                  key={term.slug}
                  href={`/term/${term.slug}`}
                  className="text-sm font-medium text-juris-cream border border-juris-cream/20 rounded-sm px-4 py-2 hover:border-juris-burgundy hover:text-juris-burgundy transition-colors"
                >
                  {term.term} →
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
