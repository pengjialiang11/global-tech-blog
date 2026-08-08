import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // CSP: 兼容 Google Analytics 4、AdSense、Next.js 内联样式与脚本
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://*.googlesyndication.com https://*.googleadservices.com https://pagead2.googlesyndication.com https://*.doubleclick.net",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.analytics.google.com",
      "frame-src 'self' https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://googleads.g.doubleclick.net",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // 全站安全响应头（HSTS / CSP / X-Frame-Options 等）
  async headers() {
    return [
      { source: "/(.*)", headers: SECURITY_HEADERS },
    ];
  },
  // www → non-www 规范跳转请在 Vercel Domain Settings 或 Cloudflare 层配置（单方向），
  // 不要在应用层重复做 redirect，否则会与基础设施的 redirect 形成无限循环 308。
  // 关闭Turbopack静态资源缓存bug
  turbopack: {
    resolveAlias: {},
  },
  // 注意：之前把 /admin/* 重写到 /admin/index.html 的规则已删除。
  // 原因：Next.js 项目没有静态 .html 页面，所有 admin 页面都是 app router 的 page.tsx。
  // 那条 rewrite 会让 Next.js 路由匹配失败，造成 404。
  // async rewrites() {
  //   return [
  //     { source: "/admin", destination: "/admin/index.html" },
  //     { source: "/admin/:slug*", destination: "/admin/index.html" },
  //   ];
  // },
};

export default nextConfig;