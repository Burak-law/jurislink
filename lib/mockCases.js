import { prisma } from "./prisma";

export async function getAllCases() {
  const cases = await prisma.case.findMany();
  // Parse JSON for relatedTerms so the shape matches the old mock
  return cases.map(c => ({
    ...c,
    relatedTerms: JSON.parse(c.relatedTerms || "[]")
  }));
}

export async function getCaseBySlug(slug) {
  const c = await prisma.case.findUnique({
    where: { slug },
  });
  if (!c) return null;
  return {
    ...c,
    relatedTerms: JSON.parse(c.relatedTerms || "[]")
  };
}
