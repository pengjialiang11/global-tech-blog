"use client";
import { useEffect, useState } from "react";

interface AdSenseProps {
  slot: string;
  format?: string;
  className?: string;
}

// 广告位组件（计划书 5.1）：publisher id 来自环境变量，未配置时显示占位
const PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB || "ca-pub-XXXXXXXXXXXXXXXX";

export default function AdSense({ slot, format = "auto", className = "" }: AdSenseProps) {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("cookie_consent");
      if (consent === "accepted") {
        setShowAd(true);
        loadAdScript();
      }
    };
    checkConsent();
    window.addEventListener("cookie-consent-accepted", checkConsent);
    return () => window.removeEventListener("cookie-consent-accepted", checkConsent);
  }, []);

  const loadAdScript = () => {
    if (document.querySelector("script[data-ad-client]")) return;
    if (PUB_ID.includes("XXXXXXXX")) return; // 占位未配置，不加载真实脚本
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.crossOrigin = "anonymous";
    script.dataset.adClient = PUB_ID;
    document.head.appendChild(script);
  };

  if (!showAd) {
    return (
      <div className={`w-full min-h-[120px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm my-6 ${className}`}>
        Advertisement
      </div>
    );
  }

  return (
    <div className={`my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
    </div>
  );
}
