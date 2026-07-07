import { getAllCases } from "@/lib/mockCases";
import { getAllTerms } from "@/lib/mockTerms";
import { getAllPractice } from "@/lib/mockPractice";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jurislink.com";

  // Fetch dynamic content
  const cases = await getAllCases();
  const terms = await getAllTerms();
  const practiceItems = await getAllPractice();

  const caseUrls = cases.map((c) => ({
    url: `${baseUrl}/case/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const termUrls = terms.map((t) => ({
    url: `${baseUrl}/term/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const practiceUrls = practiceItems.map((p) => ({
    url: `${baseUrl}/practice/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const staticUrls = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...caseUrls, ...termUrls, ...practiceUrls];
}
