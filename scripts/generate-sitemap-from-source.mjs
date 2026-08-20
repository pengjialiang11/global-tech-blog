// 直接从源码生成 sitemap/robots（不依赖 .next 预渲染产物）。
// 运行: node scripts/generate-sitemap-from-source.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
// 强制规范化 www（与 src/lib/site.ts 保持一致），避免 canonical/sitemap 出现裸域
const _raw = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sinotechlens.com";
const SITE_URL = _raw.replace(/^https?:\/\/(?!www\.)/i, (m) => `${m}www.`);
const outDir = path.join(ROOT, "public");
fs.mkdirSync(outDir, { recursive: true });

// 1) 从 tracks.ts 读取赛道 slug
const tracksSrc = fs.readFileSync(path.join(ROOT, "src/lib/tracks.ts"), "utf8");
const trackSlugs = [...tracksSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

// 2) 从 articles.json 读取已发布文章
const articles = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/data/articles.json"), "utf8")
);
const isPublic = (a) => {
  if (a.status && a.status !== "published") return false;
  if (a.scheduledDate && new Date(a.scheduledDate).getTime() > Date.now()) return false;
  return true;
};
const articleSlugs = articles.filter(isPublic).map((a) => a.slug);

// 3) 组装 URL 集合（公开页，排除 /admin*、/cms*）
const staticPaths = ["", "/articles", "/about", "/privacy-policy", "/disclaimer", "/feed.xml"];
const topicPaths = trackSlugs.map((s) => `/topics/${s}`);
const articlePaths = articleSlugs.map((s) => `/articles/${s}`);
const paths = [...staticPaths, ...topicPaths, ...articlePaths];

const urlset = paths
  .map((p) => {
    const loc = SITE_URL + p;
    const changefreq = p === "" ? "daily" : p.startsWith("/articles/") ? "weekly" : p.startsWith("/topics/") ? "daily" : "monthly";
    const priority = p === "" ? 1.0 : p.startsWith("/articles/") ? 0.8 : p.startsWith("/topics/") ? 0.75 : 0.4;
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin-login\nDisallow: /cms\nDisallow: /api\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(outDir, "robots.txt"), robots, "utf8");

console.log(`Wrote sitemap.xml (${paths.length} URLs) and robots.txt`);
console.log("Topics:", trackSlugs.join(", "));
console.log("Articles:", articleSlugs.length);
