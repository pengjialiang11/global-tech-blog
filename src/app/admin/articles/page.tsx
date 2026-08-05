"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TRACKS } from "@/lib/tracks";

interface Article {
  id: string;
  title: string;
  track: string;
  publishDate: string;
  status?: string;
  sponsored?: boolean;
}

const trackMap = new Map(TRACKS.map((t) => [t.slug, t.name]));

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/articles?includeDrafts=true");
    const data = await res.json();
    if (data.success) setArticles(data.articles);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Manage Articles</h1>
        <Link href="/admin/articles/new" className="inline-flex items-center justify-center bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">
          + New Article
        </Link>
      </div>

      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Title</th>
              <th className="text-left p-4 font-semibold text-gray-700">Track</th>
              <th className="text-left p-4 font-semibold text-gray-700">Status</th>
              <th className="text-left p-4 font-semibold text-gray-700">Date</th>
              <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="p-4">
                  <span className="font-medium text-gray-900">{a.title}</span>
                  {a.sponsored ? <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Sponsored</span> : null}
                </td>
                <td className="p-4 text-gray-600">{trackMap.get(a.track) || a.track}</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.status === "draft" ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"}`}>
                    {a.status || "published"}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{a.publishDate}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/articles/edit/${a.id}`} className="text-blue-600 hover:underline font-medium">Edit</Link>
                    <button onClick={() => remove(a.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="p-8 text-center text-gray-500">No articles yet. Create your first one.</div>
        )}
      </div>
    </div>
  );
}
