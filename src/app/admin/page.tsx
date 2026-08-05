"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ total: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?includeDrafts=true")
      .then((r) => r.json())
      .then((data) => {
        const all = data.articles || [];
        setCounts({
          total: all.length,
          published: all.filter((a: any) => a.status !== "draft").length,
          drafts: all.filter((a: any) => a.status === "draft").length,
        });
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, admin. Here is the overview of your site.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-gray-500 text-sm">Total Articles</h3>
          <p className="text-4xl font-bold mt-2">{loading ? "…" : counts.total}</p>
        </div>
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-gray-500 text-sm">Published</h3>
          <p className="text-4xl font-bold mt-2 text-green-600">{loading ? "…" : counts.published}</p>
        </div>
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-gray-500 text-sm">Drafts</h3>
          <p className="text-4xl font-bold mt-2 text-gray-600">{loading ? "…" : counts.drafts}</p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/articles/new" className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">
            + Create New Article
          </Link>
          <Link href="/admin/analytics" className="border px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            📊 View Analytics
          </Link>
          <Link href="/admin/ads" className="border px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            Manage Ads & Links
          </Link>
        </div>
      </div>
    </div>
  );
}
