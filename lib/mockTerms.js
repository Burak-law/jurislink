import { prisma } from "./prisma";

export async function getAllTerms() {
  const terms = await prisma.term.findMany();
  return terms.map(t => ({
    ...t,
    relatedTerms: JSON.parse(t.relatedTerms || "[]")
  }));
}

export async function getTermBySlug(slug) {
  const t = await prisma.term.findUnique({
    where: { slug },
  });
  if (!t) return null;
  return {
    ...t,
    relatedTerms: JSON.parse(t.relatedTerms || "[]")
  };
}
