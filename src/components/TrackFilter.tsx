"use client";

import { useState, useEffect } from "react";

interface Track {
  slug: string;
  name: string;
}

// 客户端仅做赛道显隐筛选（服务端已渲染全部文章链接，不影响 SEO）
export default function TrackFilter({ tracks }: { tracks: Track[] }) {
  const [activeTrack, setActiveTrack] = useState<string>("All");

  // 筛选：通过 data-track 属性显隐，不重新请求
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>("#article-grid > article");
    cards.forEach((card) => {
      const match = activeTrack === "All" || card.dataset.track === activeTrack;
      card.style.display = match ? "" : "none";
    });
    const visible = activeTrack === "All"
      ? cards.length
      : Array.from(cards).filter((c) => c.dataset.track === activeTrack).length;
    const empty = document.getElementById("article-empty");
    if (empty) empty.style.display = visible === 0 ? "" : "none";
  }, [activeTrack]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-2">
        <FilterButton active={activeTrack === "All"} onClick={() => setActiveTrack("All")}>
          All Tracks
        </FilterButton>
        {tracks.map((t) => (
          <FilterButton key={t.slug} active={activeTrack === t.slug} onClick={() => setActiveTrack(t.slug)}>
            {t.name}
          </FilterButton>
        ))}
      </div>
      <div id="article-empty" className="text-center py-20 text-gray-500" style={{ display: "none" }}>
        No articles found in this track.
      </div>
    </>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
        active ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
