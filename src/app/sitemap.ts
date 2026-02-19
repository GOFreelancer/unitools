import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://unitools-five.vercel.app";
  const paths = [
    "/",
    "/tools",
    "/about",
    "/contact",
    "/privacy-policy",
    "/tools/pdf-merge",
    "/tools/image-to-pdf",
    "/tools/image-compressor",
    "/tools/word-counter",
    "/tools/qr-generator",
    "/tools/pdf-editor",
  ];
  const now = new Date();
  return paths.map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.8,
  }));
}
