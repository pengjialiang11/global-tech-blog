// 权威站点 URL 统一入口。
// Vercel 已把裸域 sinotechlens.com 301 重定向到 www.sinotechlens.com，
// 为避免 canonical / og:image / sitemap 与真实 URL 冲突（搜索引擎惩罚重复内容），
// 这里强制把任何裸域值规范化为 www 前缀，无论环境变量如何设置。
const RAW = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sinotechlens.com";

export const SITE_URL: string = RAW.replace(/^https?:\/\/(?!www\.)/i, (m) => `${m}www.`);
