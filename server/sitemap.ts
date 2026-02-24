import type { Request, Response } from "express";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

/**
 * Generate sitemap.xml dynamically
 * This endpoint returns an XML sitemap for search engines
 */
export function generateSitemap(req: Request, res: Response) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const urls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/tizaia`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/generatusejercicios`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/tuexamenpersonal`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/dashboard`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 0.7,
    },
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
}
