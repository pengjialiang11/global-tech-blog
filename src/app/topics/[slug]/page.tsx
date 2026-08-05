import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TRACKS, getTrack } from "@/lib/tracks";
import { getArticlesByTrack } from "@/lib/articleData";
import AdSense from "@/components/AdSense";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

const trackStyles: Record<string, { badge: string; bg: string }> = {
  "general-china-tech": { badge: "bg-amber-100 text-amber-700", bg: "bg-amber-50" },
  "semiconductor-hardware": { badge: "bg-blue-100 text-blue-700", bg: "bg-blue-50" },
  "ai-digital-software": { badge: "bg-violet-100 text-violet-700", bg: "bg-violet-50" },
  "green-tech-manufacturing": { badge: "bg-emerald-100 text-emerald-700", bg: "bg-emerald-50" },
};

export function generateStaticParams() {
  return TRACKS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) return { title: "Track not found" };
  return {
    title: `${track.name} — SinoTechLens`,
    description: track.description,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sinotechlens.com"}/topics/${slug}` },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const articles = getArticlesByTrack(slug);
  const style = trackStyles[slug];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/articles" className="hover:text-gray-800">Articles</Link>
      </nav>

      <div className={`rounded-2xl p-8 sm:p-10 mb-10 ${style?.bg || "bg-gray-50"}`}>
        <span className={`inline-block text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded ${style?.badge || "bg-gray-100 text-gray-700"}`}>
          Track
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-3">{track.name}</h1>
        <p className="text-gray-700 text-lg max-w-3xl leading-relaxed">{track.description}</p>
        <p className="text-sm text-gray-500 mt-4">{articles.length} {articles.length === 1 ? "article" : "articles"}</p>
      </div>

      <AdSense slot="0665544332" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {articles.map((article) => (
          <article
            key={article.id}
            className="border rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold mb-3">
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
        <div className="text-center py-20 text-gray-500 bg-white border rounded-xl">
          No articles in this track yet.
        </div>
      )}
    </div>
  );
}
