export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jurislink.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/settings/", "/verify-email"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
