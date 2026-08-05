import fs from "fs";
import path from "path";

export type ContentType = "core" | "supplementary" | "niche";
export type ContentForm = "evergreen" | "news";
export type ArticleStatus = "draft" | "published";

export interface ArticleSeo {
  metaDescription?: string;
  focusKeyword?: string;
  ogImage?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  track: string; // 赛道 slug，见 src/lib/tracks.ts
  description: string;
  content: string; // HTML（TipTap 产出）或兼容纯文本
  publishDate: string;
  // ---- 计划书 3.1 / 3.3 内容体系字段 ----
  contentType?: ContentType; // core(70%) / supplementary(25%) / niche(5%)
  contentForm?: ContentForm; // evergreen(70%) / news(30%)
  tags?: string[];
  // ---- 计划书 4.2 后台字段 ----
  status?: ArticleStatus; // 默认 published
  scheduledDate?: string | null; // 定时发布
  author?: string;
  sponsored?: boolean; // 计划书 5.3 品牌合作
  seo?: ArticleSeo;
}

const dataFilePath = path.join(process.cwd(), "src", "data", "articles.json");

function readAll(): Article[] {
  const fileContent = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(fileContent) as Article[];
}

// 是否对前台公开：已发布 + 未到定时时间
function isPublic(a: Article, now = Date.now()): boolean {
  if (a.status && a.status !== "published") return false;
  if (a.scheduledDate) {
    const t = new Date(a.scheduledDate).getTime();
    if (!Number.isNaN(t) && t > now) return false;
  }
  return true;
}

export function getAllArticles(includeDrafts = false): Article[] {
  const list = readAll();
  const filtered = includeDrafts ? list : list.filter((a) => isPublic(a));
  return filtered.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getArticleBySlug(slug: string, includeDrafts = false): Article | undefined {
  return getAllArticles(includeDrafts).find((art) => art.slug === slug);
}

export function getArticlesByTrack(track: string, includeDrafts = false): Article[] {
  return getAllArticles(includeDrafts).filter((art) => art.track === track);
}

export function getArticleById(id: string, includeDrafts = false): Article | undefined {
  const list = readAll();
  const found = list.find((art) => art.id === id);
  if (!found) return undefined;
  return includeDrafts || isPublic(found) ? found : undefined;
}

export function getAllTracksUsed(): string[] {
  return Array.from(new Set(readAll().map((a) => a.track)));
}
