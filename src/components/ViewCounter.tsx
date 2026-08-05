"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const key = `views:${slug}`;
    try {
      const current = Number(localStorage.getItem(key) || "0");
      const nextCount = current + 1;
      localStorage.setItem(key, String(nextCount));
      setViews(nextCount);
    } catch {
      setViews(null);
    }
  }, [slug]);

  return (
    <div className="text-xs text-gray-400 mt-6 pt-4 border-t">
      {views === null ? "Views: —" : `Views: ${views}`}
    </div>
  );
}
