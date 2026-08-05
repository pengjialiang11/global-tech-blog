// 导入 test/boketxt 下 4 篇素材文章，并把它与现有文章统一映射到新的 4 赛道。
// 运行: node scripts/import-articles.mjs
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = "C:/Users/WIN10/Desktop/test/boketxt";
const ARTICLES_PATH = path.join(process.cwd(), "src", "data", "articles.json");

// 旧 12 赛道 -> 新 4 赛道
const TRACK_REMAP = {
  "generative-ai": "ai-digital-software",
  "ai-agent": "ai-digital-software",
  "semiconductor": "semiconductor-hardware",
  "compute-infra": "ai-digital-software",
  "humanoid-robotics": "green-tech-manufacturing",
  "embodied-ai": "ai-digital-software",
  "spatial-computing": "ai-digital-software",
  "xr-vr": "ai-digital-software",
  "low-altitude-economy": "green-tech-manufacturing",
  "quantum-computing": "general-china-tech",
  "synthetic-biology": "green-tech-manufacturing",
  "gov-digitalization": "general-china-tech",
};

// 文件名前缀 -> 新赛道 + 自定义 slug + 发布日期 + 标签
const SEED = [
  {
    file: "01-general-china-tech.md",
    track: "general-china-tech",
    slug: "china-next-new-three-ai-robotics-biopharma",
    publishDate: "2026-08-05",
    tags: ["china-tech", "export", "ai", "robotics", "biopharma"],
    focusKeyword: "China Next New Three",
  },
  {
    file: "02-semiconductor-hardware.md",
    track: "semiconductor-hardware",
    slug: "beyond-moores-law-huawei-tau-scaling-china-chip-story",
    publishDate: "2026-08-04",
    tags: ["semiconductor", "huawei", "chip", "supply-chain"],
    focusKeyword: "China semiconductor",
  },
  {
    file: "03-ai-digital-software.md",
    track: "ai-digital-software",
    slug: "deepseek-v4-open-source-bet-nvidia-huawei-silicon",
    publishDate: "2026-08-03",
    tags: ["deepseek", "open-source", "llm", "ai"],
    focusKeyword: "DeepSeek open source",
  },
  {
    file: "04-green-tech-advanced-manufacturing.md",
    track: "green-tech-manufacturing",
    slug: "china-advanced-manufacturing-machine-going-global",
    publishDate: "2026-08-02",
    tags: ["manufacturing", "green-tech", "robotics"],
    focusKeyword: "China advanced manufacturing",
  },
];

function inline(md) {
  return md
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function mdToHtml(body) {
  return body
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${inline(p.replace(/\n/g, " "))}</p>`)
    .join("\n");
}

function parseMd(content) {
  const titleMatch = content.match(/\*\*Title:\*\*\s*(.+)/);
  const descMatch = content.match(/\*\*Description:\*\*\s*(.+)/);
  const bodyIdx = content.indexOf("**Body:**");
  const body = bodyIdx >= 0 ? content.slice(bodyIdx + "**Body:**".length).trim() : "";
  return {
    title: titleMatch ? titleMatch[1].trim() : "",
    description: descMatch ? descMatch[1].trim() : "",
    content: mdToHtml(body),
  };
}

// 1) 读取现有文章并重映射赛道
const existing = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf8"));
for (const a of existing) {
  if (a.track && TRACK_REMAP[a.track]) a.track = TRACK_REMAP[a.track];
}

// 2) 解析 4 篇素材
const seeded = SEED.map((s, i) => {
  const raw = fs.readFileSync(path.join(SRC_DIR, s.file), "utf8");
  const { title, description, content } = parseMd(raw);
  return {
    id: `imp-${i + 1}`,
    slug: s.slug,
    title,
    track: s.track,
    description,
    content,
    publishDate: s.publishDate,
    contentType: "core",
    contentForm: "evergreen",
    tags: s.tags,
    status: "published",
    author: "SinoTechLens",
    sponsored: false,
    seo: {
      metaDescription: description,
      focusKeyword: s.focusKeyword,
    },
  };
});

const merged = [...existing, ...seeded];
fs.writeFileSync(ARTICLES_PATH, JSON.stringify(merged, null, 2) + "\n", "utf8");

console.log(`Wrote ${merged.length} articles to ${ARTICLES_PATH}`);
console.log("Tracks used:", Array.from(new Set(merged.map((a) => a.track))).join(", "));
