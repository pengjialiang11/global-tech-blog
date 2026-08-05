"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdSense from "@/components/AdSense";
import { TRACKS } from "@/lib/tracks";

interface Article {
  id: string;
  slug: string;
  title: string;
  track: string;
  description: string;
  publishDate: string;
}

const trackStyles: Record<string, string> = {
  "general-china-tech": "bg-amber-100 text-amber-700",
  "semiconductor-hardware": "bg-blue-100 text-blue-700",
  "ai-digital-software": "bg-violet-100 text-violet-700",
  "green-tech-manufacturing": "bg-emerald-100 text-emerald-700",
};

export default function AllArticlesPage() {
  const [activeTrack, setActiveTrack] = useState<string>("All");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setArticles(data.articles);
        setLoading(false);
      });
  }, []);

  const filtered = activeTrack === "All" ? articles : articles.filter((item) => item.track === activeTrack);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">Loading articles…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">All Articles</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Browse independent analysis across China&apos;s frontier technology tracks.
      </p>

      <AdSense slot="0987654321" />

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        <FilterButton active={activeTrack === "All"} onClick={() => setActiveTrack("All")}>
          All Tracks
        </FilterButton>
        {TRACKS.map((t) => (
          <FilterButton key={t.slug} active={activeTrack === t.slug} onClick={() => setActiveTrack(t.slug)}>
            {t.name}
          </FilterButton>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((article) => (
          <article
            key={article.id}
            className="border rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
          >
            <span className={`inline-block text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${trackStyles[article.track] || "bg-gray-100 text-gray-700"}`}>
              {TRACKS.find((t) => t.slug === article.track)?.name || article.track}
            </span>
            <h3 className="text-xl font-bold mt-3 mb-2">
              <Link href={`/articles/${article.slug}`} className="hover:text-blue-700 transition-colors">
                {article.title}
              </Link>
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{article.description}</p>
            <p className="text-xs text-gray-500">{article.publishDate}</p>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No articles found in this track.
        </div>
      )}
    </div>
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
