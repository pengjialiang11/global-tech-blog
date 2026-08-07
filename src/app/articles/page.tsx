import Link from "next/link";
import AdSense from "@/components/AdSense";
import { TRACKS } from "@/lib/tracks";
import { getAllArticles } from "@/lib/articleData";
import TrackFilter from "@/components/TrackFilter";

const trackStyles: Record<string, string> = {
  "general-china-tech": "bg-amber-100 text-amber-700",
  "semiconductor-hardware": "bg-blue-100 text-blue-700",
  "ai-digital-software": "bg-violet-100 text-violet-700",
  "green-tech-manufacturing": "bg-emerald-100 text-emerald-700",
};

// 服务端渲染：完整文章列表直接进 HTML，保证爬虫能抓到所有链接
export const metadata = {
  title: "All Articles | SinoTechLens",
  description: "Browse all articles covering China's frontier technology across semiconductors, AI, green energy, and advanced manufacturing.",
};

export default function AllArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">All Articles</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Browse independent analysis across China&apos;s frontier technology tracks.
      </p>

      <AdSense slot="0987654321" />

      <TrackFilter tracks={TRACKS} />

      <div id="article-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {articles.map((article) => (
          <article
            key={article.id}
            data-track={article.track}
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

      {articles.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No articles found.
        </div>
      )}
    </div>
  );
}
