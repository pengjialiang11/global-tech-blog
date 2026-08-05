// One-off helper: build a populated sitemap.xml + robots.txt from the
// prerendered .html output of `next build` (.next/server/app).
// This is useful in environments where `next build`'s final cache-cleanup
// step is blocked (e.g. a sandbox safe-delete guard). On a normal machine
// `npm run build` already runs `next-sitemap` to regenerate these files.
import fs from "fs";
import path from "path";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sinotechlens.com";
const appDir = path.join(process.cwd(), ".next", "server", "app");
const publicDir = path.join(process.cwd(), "public");

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(appDir);

const isExcluded = (route) =>
  route.startsWith("/_") ||
  route === "/_not-found" ||
  route.startsWith("/admin") ||
  route.startsWith("/api");

const urls = new Set();
for (const f of htmlFiles) {
  let route = f
    .replace(appDir, "")
    .replace(/\\/g, "/")
    .replace(/\.html$/, "");
  if (route === "/index") route = "/";
  if (isExcluded(route)) continue;
  urls.add(route);
}

const urlList = [...urls].sort();
const urlset = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList
  .map((u) => `  <url><loc>${SITE}${u}</loc></url>`)
  .join("\n")}
</urlset>
`;
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), urlset);
fs.writeFileSync(
  path.join(publicDir, "robots.txt"),
  `# *\nUser-agent: *\nAllow: /\n\n# Host\nHost: ${SITE}\n\n# Sitemaps\nSitemap: ${SITE}/sitemap.xml\n`
);
console.log(`Wrote sitemap.xml with ${urlList.length} URLs:\n` + urlList.join("\n"));
