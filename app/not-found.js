import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="px-6 md:px-16 py-24 text-center">
        <p className="text-juris-burgundy text-xs uppercase tracking-[0.3em] font-semibold mb-4">
          404
        </p>
        <h1 className="font-heading font-bold text-juris-cream text-3xl md:text-4xl mb-4">
          This page isn&apos;t on the docket.
        </h1>
        <p className="text-juris-cream/60 max-w-md mx-auto mb-8">
          The case or term you're looking for doesn't exist yet, or may have moved.
        </p>
        <Link
          href="/search"
          className="inline-block bg-juris-burgundy text-juris-cream font-semibold px-6 py-3 rounded-sm hover:bg-juris-burgundy/90 transition-colors"
        >
          Back to Search
        </Link>
      </section>
      <Footer />
    </>
  );
}
