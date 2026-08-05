import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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