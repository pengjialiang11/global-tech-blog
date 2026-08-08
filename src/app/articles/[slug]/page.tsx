import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticles, getArticlesByTrack } from "@/lib/articleData";
import { getTrack } from "@/lib/tracks";
import AdSense from "@/components/AdSense";
import AffiliateList from "@/components/AffiliateList";
import ViewCounter from "@/components/ViewCounter";
import Script from "next/script";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sinotechlens.com";

const trackStyles: Record<string, string> = {
  "general-china-tech": "bg-amber-100 text-amber-700",
  "semiconductor-hardware": "bg-blue-100 text-blue-700",
  "ai-digital-software": "bg-violet-100 text-violet-700",
  "green-tech-manufacturing": "bg-emerald-100 text-emerald-700",
};

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };

  const url = `${SITE_URL}/articles/${slug}`;
  const description = article.seo?.metaDescription || article.description;

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      url,
      type: "article",
      publishedTime: article.publishDate,
      images: article.seo?.ogImage ? [article.seo.ogImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const track = getTrack(article.track);
  const url = `${SITE_URL}/articles/${slug}`;
  const related = getArticlesByTrack(article.track).filter((a) => a.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    author: { "@type": "Organization", name: article.author || "SinoTechLens" },
    ...(article.seo?.ogImage ? { image: [article.seo.ogImage] } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/articles" className="hover:text-gray-800">Articles</Link>
        {track && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/topics/${track.slug}`} className="hover:text-gray-800">{track.name}</Link>
          </>
        )}
      </nav>

      {article.sponsored ? (
        <span className="inline-block mb-3 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded">
          Sponsored
        </span>
      ) : null}

      <span className={`inline-block text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${trackStyles[article.track] || "bg-gray-100 text-gray-700"}`}>
        {track ? track.name : article.track}
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-4 leading-tight">{article.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
        <span>{article.author || "SinoTechLens"}</span>
        <span>•</span>
        <span>{article.publishDate}</span>
      </div>

      <p className="text-lg text-gray-700 leading-relaxed mb-8 font-medium">
        {article.description}
      </p>

      <AdSense slot="1122334455" />

      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <AffiliateList track={article.track} />

      <AdSense slot="5544332211" />

      <ViewCounter slug={slug} />

      {related.length > 0 && (
        <section className="mt-14 pt-10 border-t">
          <h2 className="text-xl font-bold mb-5">Related in {track?.name}</h2>
          <div className="space-y-4">
            {related.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-semibold text-gray-900">{a.title}</p>
                <p className="text-sm text-gray-500 mt-1">{a.publishDate}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Script
        id={`json-ld-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>
    </article>
  );
}
