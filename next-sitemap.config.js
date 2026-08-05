/** @type {import('next-sitemap').IConfig} */
const TRACK_SLUGS = [
  "general-china-tech",
  "semiconductor-hardware",
  "ai-digital-software",
  "green-tech-manufacturing",
];

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://sinotechlens.com",
  generateRobotsTxt: true,
  outDir: "./public",
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/cms/*", "/admin/*", "/admin-login"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
  transform: async (config, path) => {
    if (path === "/") return { loc: path, changefreq: "daily", priority: 1.0 };
    if (path.startsWith("/articles/")) return { loc: path, changefreq: "weekly", priority: 0.8 };
    // 赛道栏目页（真实存在的路由，修正原计划引用的无效路径）
    if (TRACK_SLUGS.some((s) => path === `/topics/${s}`)) {
      return { loc: path, changefreq: "daily", priority: 0.75 };
    }
    if (["/about", "/privacy-policy", "/disclaimer", "/articles"].includes(path)) {
      return { loc: path, changefreq: "monthly", priority: 0.4 };
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority };
  },
};
