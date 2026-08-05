"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TRACKS } from "@/lib/tracks";

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    name: "", track: "ai-digital-software", targetUrl: "", status: "Active", commission: "", note: "", featured: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch("/api/affiliates?all=true").then((r) => r.json()).then((data) => {
      const a = data.affiliates?.find((x: any) => x.id === id);
      if (a) setForm({ name: a.name, track: a.track, targetUrl: a.targetUrl, status: a.status, commission: a.commission || "", note: a.note || "", featured: Boolean(a.featured) });
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/affiliates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });
    const data = await res.json();
    if (data.success) { alert("Saved!"); router.push("/admin/ads"); router.refresh(); }
    else alert("Failed: " + (data.message || ""));
  };

  if (loading) return <div className="p-6">Loading…</div>;
  const field = "w-full border p-3 rounded";
  const label = "block mb-1 font-medium";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Affiliate / Ad Link</h1>
        <button onClick={() => router.back()} className="border px-4 py-2 rounded hover:bg-gray-100">Back</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <div>
          <label className={label}>Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} required />
        </div>
        <div>
          <label className={label}>Track</label>
          <select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })} className={field}>
            {TRACKS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Target URL</label>
          <input type="url" value={form.targetUrl} onChange={(e) => setForm({ ...form, targetUrl: e.target.value })} className={field} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={field}>
              <option>Active</option><option>Paused</option><option>Expired</option>
            </select>
          </div>
          <div>
            <label className={label}>Commission</label>
            <input type="text" value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} className={field} />
          </div>
        </div>
        <div>
          <label className={label}>Notes</label>
          <textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={field} />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          <span className={label}>Featured</span>
        </label>
        <button type="submit" className="bg-black text-white px-6 py-3 rounded text-lg">Save Changes</button>
      </form>
    </div>
  );
}
