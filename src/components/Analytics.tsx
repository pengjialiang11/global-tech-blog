"use client";

import { useEffect } from "react";

// 同意门控的数据分析（计划书 六：GDPR/CCPA）
// 仅当用户接受 Cookie 后才加载分析脚本；provider/id 来自环境变量。
export default function Analytics() {
  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent !== "accepted") return; // 未同意不加载

    const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
    const id = process.env.NEXT_PUBLIC_ANALYTICS_ID;
    if (!provider || !id) return;

    if (provider === "ga4") {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
      const inline = document.createElement("script");
      inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`;
      document.head.appendChild(inline);
    } else if (provider === "plausible") {
      const s = document.createElement("script");
      s.async = true;
      s.defer = true;
      s.dataset.domain = id;
      s.src = "https://plausible.io/js/script.js";
      document.head.appendChild(s);
    }
  }, []);

  return null;
}
