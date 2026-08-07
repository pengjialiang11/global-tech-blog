import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articleData";
import { getTrack } from "@/lib/tracks";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sinotechlens.com";

export async function GET() {
  const articles = getAllArticles().slice(0, 50);
  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/articles/${a.slug}`;
      const track = getTrack(a.track);
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(a.publishDate).toUTCString()}</pubDate>
      <category>${escapeXml(track?.name || a.track)}</category>
      <description>${escapeXml(a.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SinoTechLens</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml("China frontier tech & cross-border technology trends")}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
