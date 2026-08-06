import Link from "next/link";
import AdSense from "@/components/AdSense";
import { getAllArticles, getArticlesByTrack } from "@/lib/articleData";
import { TRACKS, getTrack } from "@/lib/tracks";

export default function HomePage() {
  const latestArticles = getAllArticles().slice(0, 4);

  const trackStyles: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    "general-china-tech": {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      badge: "bg-amber-100 text-amber-700",
    },
    "semiconductor-hardware": {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      badge: "bg-blue-100 text-blue-700",
    },
    "ai-digital-software": {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-900",
      badge: "bg-violet-100 text-violet-700",
    },
    "green-tech-manufacturing": {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-900",
      badge: "bg-emerald-100 text-emerald-700",
    },
  };

  return (
    <main>
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            Welcome to SinoTechLens
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Independent English blog tracking real-world industrial deployment of China&apos;s breakthrough technologies and global cross-border tech shifts.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/articles"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Top ad */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <AdSense slot="1234567890" />
      </div>

      {/* Latest articles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <p className="text-gray-500 mt-1">Fresh analysis across all tracks</p>
          </div>
          <Link href="/articles" className="text-sm font-medium text-blue-700 hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestArticles.map((article) => {
            const track = getTrack(article.track);
            const style = trackStyles[article.track];
            return (
              <article
                key={article.id}
                className="border rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
              >
                <span className={`inline-block text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${style?.badge || "bg-gray-100 text-gray-700"}`}>
                  {track?.name || article.track}
                </span>
                <h3 className="text-xl font-bold mt-3 mb-2">
                  <Link href={`/articles/${article.slug}`} className="hover:text-blue-700 transition-colors">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{article.description}</p>
                <p className="text-xs text-gray-500">{article.publishDate}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTIONS grid — inspired by the screenshot reference */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TRACKS.map((track) => {
            const count = getArticlesByTrack(track.slug).length;
            const style = trackStyles[track.slug];
            return (
              <Link
                key={track.slug}
                href={`/topics/${track.slug}`}
                className={`group block p-6 sm:p-8 rounded-xl border ${style.bg} ${style.border} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-xl font-bold ${style.text}`}>{track.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                    {count} {count === 1 ? "article" : "articles"}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{track.description}</p>
                <span className={`inline-flex items-center text-sm font-semibold ${style.text} group-hover:underline`}>
                  Read the section
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
