import { prisma } from "./prisma";

export async function getAllPractice() {
  const practices = await prisma.practice.findMany();
  return practices.map(p => ({
    ...p,
    structure: p.structure ? JSON.parse(p.structure) : undefined,
    questions: p.questions ? JSON.parse(p.questions) : undefined,
    relatedTerms: p.relatedTerms ? JSON.parse(p.relatedTerms) : []
  }));
}

export async function getPracticeBySlug(slug) {
  const p = await prisma.practice.findUnique({
    where: { slug },
  });
  if (!p) return null;
  return {
    ...p,
    structure: p.structure ? JSON.parse(p.structure) : undefined,
    questions: p.questions ? JSON.parse(p.questions) : undefined,
    relatedTerms: p.relatedTerms ? JSON.parse(p.relatedTerms) : []
  };
}
