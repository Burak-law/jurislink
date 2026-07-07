import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getAllCases } from "@/lib/mockCases";
import { getAllTerms } from "@/lib/mockTerms";
import { getAllPractice } from "@/lib/mockPractice";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const userId = session.user.id;

  const [activities, essayDrafts, allCases, allTerms, allPractice] = await Promise.all([
    prisma.activity.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.essayDraft.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    getAllCases(),
    getAllTerms(),
    getAllPractice(),
  ]);

  const casesRead = activities.filter((a) => a.type === "case_read");
  const termsLearned = activities.filter((a) => a.type === "term_learned");
  const quizzesCompleted = activities.filter((a) => a.type === "quiz_completed");

  const readCaseSlugs = new Set(casesRead.map((a) => a.targetSlug));
  const learnedTermSlugs = new Set(termsLearned.map((a) => a.targetSlug));
  const completedQuizSlugs = new Set(quizzesCompleted.map((a) => a.targetSlug));

  // --- Stats ---
  const quizAverage =
    quizzesCompleted.length > 0
      ? Math.round(
          (quizzesCompleted.reduce(
            (sum, a) => sum + (a.resultTotal ? a.resultCorrect / a.resultTotal : 0),
            0
          ) /
            quizzesCompleted.length) *
            100
        )
      : null;

  const stats = {
    casesStudied: readCaseSlugs.size,
    termsLearned: learnedTermSlugs.size,
    essaysDrafted: essayDrafts.length,
    quizAverage: quizAverage === null ? "—" : `${quizAverage}%`,
  };

  // --- Progress by area of law ---
  // Every case/term is tagged with an areaOfLaw string. We bucket the primary
  // category (text before " · ") and compute what fraction of that area's
  // items this user has touched.
  function primaryArea(label) {
    if (!label) return "Other";
    return label.split("·")[0].trim();
  }

  const areaTotals = new Map();
  const areaStudied = new Map();

  for (const c of allCases) {
    const area = primaryArea(c.areaOfLaw);
    areaTotals.set(area, (areaTotals.get(area) || 0) + 1);
    if (readCaseSlugs.has(c.slug)) {
      areaStudied.set(area, (areaStudied.get(area) || 0) + 1);
    }
  }
  for (const t of allTerms) {
    const area = primaryArea(t.areaOfLaw);
    areaTotals.set(area, (areaTotals.get(area) || 0) + 1);
    if (learnedTermSlugs.has(t.slug)) {
      areaStudied.set(area, (areaStudied.get(area) || 0) + 1);
    }
  }

  const areaProgress = Array.from(areaTotals.entries())
    .map(([area, total]) => ({
      area,
      percent: Math.round(((areaStudied.get(area) || 0) / total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);

  // --- Continue learning: things not finished yet ---
  const continueLearning = [];

  for (const draft of essayDrafts) {
    const practiceItem = allPractice.find((p) => p.slug === draft.practiceSlug);
    if (practiceItem) {
      continueLearning.push({
        type: "essay",
        slug: practiceItem.slug,
        title: practiceItem.title,
        note: "Draft in progress",
      });
    }
  }

  for (const quiz of allPractice.filter((p) => p.type === "quiz")) {
    if (!completedQuizSlugs.has(quiz.slug)) {
      continueLearning.push({
        type: "quiz",
        slug: quiz.slug,
        title: quiz.title,
        note: "Not started yet",
      });
    }
  }

  for (const c of allCases) {
    if (!readCaseSlugs.has(c.slug)) {
      continueLearning.push({
        type: "case",
        slug: c.slug,
        title: c.title,
        note: "Not started yet",
      });
    }
  }

  // --- Recent activity feed (activities + draft saves, merged) ---
  const feedItems = [
    ...activities.map((a) => ({
      date: a.createdAt,
      action:
        a.type === "case_read"
          ? "Read case"
          : a.type === "term_learned"
          ? "Learned term"
          : "Completed quiz",
      target: a.targetTitle,
      result:
        a.type === "quiz_completed" && a.resultTotal
          ? `${a.resultCorrect}/${a.resultTotal} correct`
          : null,
    })),
    ...essayDrafts.map((d) => {
      const practiceItem = allPractice.find((p) => p.slug === d.practiceSlug);
      return {
        date: d.updatedAt,
        action: "Saved draft",
        target: practiceItem?.title ?? d.practiceSlug,
        result: null,
      };
    }),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)
    .map((item, i) => ({
      id: `${item.action}-${i}-${item.date}`,
      ...item,
      date: formatRelativeTime(item.date),
    }));

  return NextResponse.json({
    stats,
    areaProgress,
    continueLearning: continueLearning.slice(0, 3),
    recentActivity: feedItems,
  });
}
