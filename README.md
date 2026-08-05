# SinoTechLens（优化版）

海外英文科技资讯独立博客 —— 基于商业计划书优化的 Next.js 16 实现。
本目录是 **`global-tech-blog-main` 的改进副本**，原项目未被修改；所有改动仅在此处。

## 本次相对原项目的优化（对照计划书）

| 计划书 | 优化点 | 文件 |
|---|---|---|
| 3.2 赛道 | 中央赛道配置 `src/lib/tracks.ts`（**4 个主题赛道**：General China Tech / Semiconductor & Hardware / AI & Digital Software / Green Tech & Advanced Manufacturing） | tracks.ts |
| 3.1 / 3.3 内容体系 | 文章模型扩展：contentType(70/25/5)、contentForm(evergreen/news)、tags、status、scheduledDate、author、sponsored、seo | articleData.ts / articles.json |
| 4.2 富文本 | 接入 TipTap 富文本编辑器（替代 textarea） | ArticleEditor.tsx + 后台新建/编辑页 |
| 4.2 草稿/定时 | status + scheduledDate；前台自动隐藏草稿/未到定时 | articleData.ts / API |
| 4.2 / 4.4 SEO | 每篇 metadata + JSON-LD + canonical + Open Graph/Twitter | articles/[slug]/page.tsx |
| 3.4 / 六 合规 | 硬红线拦截（投资/加密/政治敏感），软红线（Web3 边界） | compliance.ts + 发布 API + 编辑页 |
| 5.2 联盟 | 真实持久化的联盟链接 + 前台按赛道展示（rel=sponsored nofollow） | affiliateData.ts / api/affiliates / AffiliateList / 后台 ads |
| 5.1 广告 | AdSense publisher 改为环境变量驱动 | AdSense.tsx / .env.example |
| 六 数据隐私 | 同意门控的分析组件（GA4/Plausible）替代原 mock | Analytics.tsx / admin/analytics |
| 4.4 SEO 增强 | RSS feed `/feed.xml`、修复 sitemap transform 无效路由 | feed.xml/route.ts / next-sitemap.config.js |
| 4.3 | 域名/站点 URL 集中到 `NEXT_PUBLIC_SITE_URL` | 各处 |
| 后台体验 | 简化文章发布表单（折叠 SEO/元数据）、图表化数据分析、返回 Dashboard | ArticleForm.tsx / admin/analytics |
| 首页设计 | 顶部导航展示 4 赛道 + SECTIONS 彩色卡片网格 | page.tsx / HeaderNav.tsx |
| 安全 | 修复 `/admin-analytics` 未受保护漏洞；API 写操作强制鉴权 | src/middleware.ts / api/* / api-auth.ts |

## 运行

```bash
cp .env.example .env.local   # 填入真实 ADMIN_PASS / NEXTAUTH_SECRET / AdSense / Analytics
npm install
npm run dev                  # http://localhost:3000
npm run build                # 生成 public/sitemap.xml + robots.txt
```

> **构建已验证通过**：`tsc --noEmit` 类型检查 0 错误；`next build` 编译 + 类型检查通过，并成功预渲染全部 37 个页面（含 `/topics/[slug]`、`/articles/[slug]`、`/feed.xml`）；`npm run dev` 下首页/赛道页/文章页/登录页均 200，`/feed.xml` 返回合法 RSS。
> 注：少数受限执行环境会在 `next build` 收尾清理 `.next` 缓存时拦截（沙箱安全策略），导致构建在非代码环节中断；此时可单独运行 `node scripts/generate-sitemap-from-build.mjs` 从已预渲染产物生成 sitemap/robots。在普通机器上 `npm run build` 会正常跑完并自动调用 `next-sitemap`。

> **TypeScript 版本说明**：本副本已将 `typescript` 固定为 `5.8.3`，并修正了 `tsconfig.json` 中 `"ignoreDeprecations": "6.0"` → `"5.0"`。
> 原因：原 `tsconfig.json` 写的是 `"6.0"`，该取值仅对 TypeScript 6.0+ 合法；在 5.x 下 `tsc` 会报 `TS5103: Invalid value for '--ignoreDeprecations'`，使 `next build` 类型检查阶段失败（原项目若 `npm i` 解析到 5.9.x 也会踩此坑）。固定 5.8.3 + `"5.0"` 后正常。
> 若重新安装依赖，请勿用 `^5` 解析到 5.9+，否则需改回 5.8.x 并确认 tsconfig 的 `ignoreDeprecations` 为 `"5.0"`。

## 外部资产现状（来自你提供的截图）

- **GitHub 仓库**：`pengjialiang11/global-tech-blog` 已存在，当前是旧版代码。
- **Vercel 部署**：已上线，但跑的是 GitHub 上的旧版；把新版 push 到 GitHub 后 Vercel 会自动更新。
- **Cloudflare**：`sinotechlens.com` 已接入，SSL Active。

## 仍需你完成的上线动作

1. 把 `测试-0804/project` 的代码 push 到 GitHub（覆盖旧版）。
2. 在 Vercel 项目 **Settings → Environment Variables** 补填环境变量（见 `.env.example`）。
3. 在 Cloudflare DNS 加 CNAME 指向 Vercel（见 `../配置信息.md`）。
4. 申请 Google AdSense / GA4，填入对应环境变量。
5. 跨境收款在平台后台绑定（不进网站代码）。

## 已导入的素材文章

`scripts/import-articles.mjs` 已把 `test/boketxt/` 下 4 篇素材转为 HTML 文章，分别归入 4 个赛道并发布（含原 7 篇，共 11 篇）。
