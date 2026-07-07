import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PracticeEssayEditor from "@/components/PracticeEssayEditor";
import PracticeQuiz from "@/components/PracticeQuiz";
import { getAllPractice, getPracticeBySlug } from "@/lib/mockPractice";
import { getCaseBySlug } from "@/lib/mockCases";
import { getAllTerms } from "@/lib/mockTerms";

const typeLabel = {
  essay: "Practice · Essay",
  quiz: "Practice · Quiz",
};

export async function generateStaticParams() {
  const allPractice = await getAllPractice();
  return allPractice.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const item = await getPracticeBySlug(params.slug);
  if (!item) return { title: "Practice Not Found — JurisLink" };

  return {
    title: `${item.title} — JurisLink`,
    description: `Practice your legal skills: ${item.title}. Type: ${item.type}. Area of law: ${item.areaOfLaw}.`,
    openGraph: {
      title: `${item.title} — JurisLink`,
      description: item.type === 'essay' ? `Practice essay: ${item.title}` : `Test your knowledge: ${item.title}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: item.title,
      description: `Practice your legal skills: ${item.title}`,
    },
  };
}

export default async function PracticeDetailPage({ params }) {
  const item = await getPracticeBySlug(params.slug);
  if (!item) notFound();

  const relatedCase = item.relatedCase ? await getCaseBySlug(item.relatedCase) : null;
  const allTerms = await getAllTerms();
  const relatedTerms = allTerms.filter((t) =>
    (item.relatedTerms || []).includes(t.slug)
  );

  return (
    <>
      <Header />

      <article className="px-6 md:px-16 pt-10 pb-24 max-w-3xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Search", href: "/search" },
            { label: item.title },
          ]}
        />

        <header className="bg-juris-cream text-juris-navy rounded-sm border-t-4 border-juris-burgundy p-8 md:p-10 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-juris-burgundy font-bold">
            {typeLabel[item.type]}
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mt-3 mb-2">
            {item.title}
          </h1>
          <p className="text-sm text-juris-navy/60">{item.areaOfLaw}</p>
        </header>

        {item.type === "essay" && (
          <>
            <section className="mb-10">
              <h2 className="font-heading font-bold text-xl text-juris-cream mb-3">
                Scenario
              </h2>
              <p className="bg-juris-burgundy/10 border border-juris-burgundy/30 rounded-sm p-6 text-juris-cream/80 leading-relaxed italic">
                {item.prompt}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading font-bold text-xl text-juris-cream mb-3">
                Instructions
              </h2>
              <p className="text-juris-cream/70 leading-relaxed">
                {item.instructions}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading font-bold text-xl text-juris-cream mb-4">
                Suggested Structure
              </h2>
              <ol className="flex flex-col gap-4">
                {item.structure.map((step, i) => (
                  <li key={step.label} className="flex gap-4">
                    <span className="font-heading font-bold text-juris-burgundy text-lg leading-none">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-juris-cream">{step.label}</p>
                      <p className="text-juris-cream/60 text-sm leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <PracticeEssayEditor slug={item.slug} />
          </>
        )}

        {item.type === "quiz" && (
          <>
            <section className="mb-10">
              <p className="text-juris-cream/70 leading-relaxed">
                {item.description}
              </p>
            </section>

            <PracticeQuiz questions={item.questions} slug={item.slug} title={item.title} />
          </>
        )}

        {(relatedCase || relatedTerms.length > 0) && (
          <section>
            <h2 className="font-heading font-bold text-lg text-juris-cream mb-4">
              Related Resources
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedCase && (
                <Link
                  href={`/case/${relatedCase.slug}`}
                  className="text-sm font-medium text-juris-cream border border-juris-cream/20 rounded-sm px-4 py-2 hover:border-juris-burgundy hover:text-juris-burgundy transition-colors"
                >
                  {relatedCase.title} →
                </Link>
              )}
              {relatedTerms.map((term) => (
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
