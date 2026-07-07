import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return NextResponse.json({ results: [] });
  }

  const q = query.trim().toLowerCase();

  try {
    const [decisions, terms, practices] = await Promise.all([
      prisma.yargitayDecision.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.term.findMany(),
      prisma.practice.findMany()
    ]);

    const searchData = [];

    // Filter manually because SQLite contains operator is sometimes tricky
    const filteredDecisions = decisions.filter(
      (d) => 
        d.summary.toLowerCase().includes(q) ||
        d.areaOfLaw.toLowerCase().includes(q) ||
        d.court.toLowerCase().includes(q) ||
        d.esasNo.toLowerCase().includes(q) ||
        d.kararNo.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredTerms = terms.filter(
      (t) => 
        t.term.toLowerCase().includes(q) ||
        (t.definition && t.definition.toLowerCase().includes(q))
    ).slice(0, 3);

    const filteredPractices = practices.filter(
      (p) => 
        p.title.toLowerCase().includes(q) ||
        (p.areaOfLaw && p.areaOfLaw.toLowerCase().includes(q))
    ).slice(0, 3);

    filteredDecisions.forEach(c => {
      searchData.push({
        id: `case-${c.id}`,
        type: "yargitay",
        slug: c.slug,
        title: `${c.esasNo} - ${c.kararNo}`,
        snippet: c.summary ? (c.summary.substring(0, 80) + "...") : "Yargıtay kararı",
        href: `/yargitay?q=${c.slug}`
      });
    });

    filteredTerms.forEach(t => {
      searchData.push({
        id: `vocab-${t.id}`,
        type: "vocabulary",
        slug: t.slug,
        title: t.term,
        snippet: t.definition ? (t.definition.substring(0, 80) + "...") : "Hukuki terim",
        href: `/term/${t.slug}`
      });
    });

    filteredPractices.forEach(p => {
      searchData.push({
        id: `practice-${p.id}`,
        type: "practice",
        slug: p.slug,
        title: p.title,
        snippet: "Pratik Egzersizi",
        href: `/practice/${p.slug}`
      });
    });

    return NextResponse.json({ results: searchData.slice(0, 6) });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
