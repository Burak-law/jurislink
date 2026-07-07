import { prisma } from "./prisma";

export async function getAllSearchData() {
  const [cases, terms, practices] = await Promise.all([
    prisma.yargitayDecision.findMany(),
    prisma.term.findMany(),
    prisma.practice.findMany(),
  ]);

  const searchData = [];

  cases.forEach(c => {
    searchData.push({
      id: `case-${c.id}`,
      type: "yargitay",
      slug: c.slug,
      title: `${c.esasNo} - ${c.kararNo}`,
      snippet: c.summary ? (c.summary.substring(0, 120) + "...") : "Yargıtay kararı",
      meta: `${c.court || ""} · ${c.areaOfLaw || ""}`,
    });
  });

  terms.forEach(t => {
    searchData.push({
      id: `vocab-${t.id}`,
      type: "vocabulary",
      slug: t.slug,
      title: t.term,
      snippet: t.definition ? (t.definition.substring(0, 120) + "...") : "Hukuki terim",
      meta: `${t.areaOfLaw || ""} · Terim`,
    });
  });

  practices.forEach(p => {
    searchData.push({
      id: `practice-${p.id}`,
      type: "practice",
      slug: p.slug,
      title: p.title,
      snippet: p.description || p.prompt ? (p.description || p.prompt).substring(0, 120) + "..." : "Pratik egzersizi",
      meta: `${p.areaOfLaw || ""} · ${p.type === 'essay' ? 'Yazma Egzersizi' : 'Test (Quiz)'}`,
    });
  });

  return searchData;
}
