"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 只在客户端挂载后执行，服务端和客户端首次渲染保持一致
  useEffect(() => {
    setIsMounted(true);
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
    // 触发广告加载事件
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShow(false);
  };

  if (!isMounted || !show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          We use cookies to analyze website traffic and optimize your experience. By accepting, you consent to the use of cookies. You may decline non-essential cookies. Read more in our{" "}
          <a href="/privacy-policy" className="underline">Privacy Policy</a>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="bg-blue-600 px-5 py-2 rounded text-white"
          >
            Accept Cookies
          </button>
          <button
            onClick={decline}
            className="border border-white px-5 py-2 rounded"
          >
            Decline Non-Essential
          </button>
        </div>
      </div>
    </div>
  );
}