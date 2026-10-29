import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sites.sysotto.com/rainhadaspolpas";
  const cleanUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${cleanUrl}/sitemap.xml`,
  };
}
