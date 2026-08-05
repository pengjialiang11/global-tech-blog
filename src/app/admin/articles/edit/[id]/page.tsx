"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArticleForm, { ArticleFormData } from "@/components/ArticleForm";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [initial, setInitial] = useState<Partial<ArticleFormData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/articles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const a = data.article;
          setInitial({
            title: a.title || "",
            slug: a.slug || "",
            track: a.track || "ai-digital-software",
            content: a.content || "",
            publishDate: a.publishDate || "",
            contentType: a.contentType || "core",
            contentForm: a.contentForm || "evergreen",
            status: a.status || "published",
            scheduledDate: a.scheduledDate || "",
            author: a.author || "SinoTechLens",
            sponsored: Boolean(a.sponsored),
            metaDescription: a.seo?.metaDescription || "",
            focusKeyword: a.seo?.focusKeyword || "",
            ogImage: a.seo?.ogImage || "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!initial) return <div className="p-6 text-red-600">Article not found.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <button onClick={() => router.back()} className="text-sm text-gray-600 hover:text-black">← Back</button>
      </div>
      <ArticleForm mode="edit" initial={initial} articleId={id} />
    </div>
  );
}
