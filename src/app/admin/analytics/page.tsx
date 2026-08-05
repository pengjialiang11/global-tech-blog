"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { TRACKS, getTrack } from "@/lib/tracks";

interface Article {
  id: string;
  title: string;
  track: string;
  status: string;
  publishDate: string;
  contentType: string;
  contentForm: string;
  sponsored: boolean;
}

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"];

export default function AdminAnalyticsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?includeDrafts=true")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      });
  }, []);

  const total = articles.length;
  const published = articles.filter((a) => a.status !== "draft").length;
  const drafts = articles.filter((a) => a.status === "draft").length;
  const sponsored = articles.filter((a) => a.sponsored).length;

  const trackData = TRACKS.map((t) => ({
    name: t.name,
    count: articles.filter((a) => a.track === t.slug).length,
  })).filter((d) => d.count > 0);

  const typeData = [
    { name: "Core", value: articles.filter((a) => a.contentType === "core").length },
    { name: "Supplementary", value: articles.filter((a) => a.contentType === "supplementary").length },
    { name: "Niche", value: articles.filter((a) => a.contentType === "niche").length },
  ].filter((d) => d.value > 0);

  const formData = [
    { name: "Evergreen", value: articles.filter((a) => a.contentForm === "evergreen").length },
    { name: "News", value: articles.filter((a) => a.contentForm === "news").length },
  ].filter((d) => d.value > 0);

  // Timeline: articles by month
  const timelineMap = new Map<string, number>();
  articles.forEach((a) => {
    const key = a.publishDate.slice(0, 7); // YYYY-MM
    timelineMap.set(key, (timelineMap.get(key) || 0) + 1);
  });
  const timeline = Array.from(timelineMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
  const analyticsConfigured = Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID && provider);

  if (loading) return <div className="p-6">Loading analytics…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Link href="/admin" className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Articles" value={total} />
        <KpiCard label="Published" value={published} color="text-green-600" />
        <KpiCard label="Drafts" value={drafts} color="text-gray-600" />
        <KpiCard label="Sponsored" value={sponsored} color="text-amber-600" />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Articles by Track">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trackData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {trackData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Content Mix">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-2 text-center">By Type (70/25/5)</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2 text-center">By Form</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={formData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {formData.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Publishing Timeline" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Traffic analytics config */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Traffic Analytics</h3>
        {analyticsConfigured ? (
          <p className="text-green-700">
            Connected: <strong>{provider?.toUpperCase()}</strong> (data flows after visitors accept cookies).
          </p>
        ) : (
          <div className="text-gray-600 space-y-2 text-sm">
            <p>Real traffic stats are not connected yet. To enable:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Set <code>NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4</code> or <code>plausible</code></li>
              <li>Set <code>NEXT_PUBLIC_ANALYTICS_ID=G-XXXX</code> / your Plausible domain</li>
              <li>Analytics loads only after the visitor accepts cookies (GDPR/CCPA)</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, color = "text-black" }: { label: string; value: number; color?: string }) {
  return (
    <div className="border rounded-lg p-5 bg-white shadow-sm">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border rounded-lg p-5 bg-white shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
