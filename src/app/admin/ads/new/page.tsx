"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TRACKS } from "@/lib/tracks";

export default function NewAdPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    track: "ai-digital-software",
    targetUrl: "",
    status: "Active",
    commission: "",
    note: "",
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/affiliates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      alert("Affiliate link saved!");
      router.push("/admin/ads");
      router.refresh();
    } else {
      alert("Failed: " + (data.message || ""));
    }
  };

  const field = "w-full border p-3 rounded";
  const label = "block mb-1 font-medium";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add Affiliate / Ad Link</h1>
        <button onClick={() => router.back()} className="border px-4 py-2 rounded hover:bg-gray-100">Back</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <div>
          <label className={label}>Name (internal reference)</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} placeholder="e.g. Nebula GPU Cloud" required />
        </div>
        <div>
          <label className={label}>Track（关联赛道，用于前台按赛道展示）</label>
          <select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })} className={field}>
            {TRACKS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Target URL（联盟/广告链接）</label>
          <input type="url" value={form.targetUrl} onChange={(e) => setForm({ ...form, targetUrl: e.target.value })} className={field} placeholder="https://example.com/your-affiliate-link" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={field}>
              <option>Active</option>
              <option>Paused</option>
              <option>Expired</option>
            </select>
          </div>
          <div>
            <label className={label}>Commission</label>
            <input type="text" value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} className={field} placeholder="e.g. 20%" />
          </div>
        </div>
        <div>
          <label className={label}>Notes</label>
          <textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={field} />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          <span className={label}>Featured（前台高亮）</span>
        </label>
        <button type="submit" className="bg-black text-white px-6 py-3 rounded text-lg">Save Link</button>
      </form>
    </div>
  );
}
