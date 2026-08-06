"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TRACKS } from "@/lib/tracks";
import { getHardViolations, getSoftWarnings } from "@/lib/compliance";

export interface ArticleFormData {
  title: string;
  slug: string;
  track: string;
  content: string;
  publishDate: string;
  contentType: "core" | "supplementary" | "niche";
  contentForm: "evergreen" | "news";
  status: "published" | "draft";
  scheduledDate: string;
  author: string;
  sponsored: boolean;
  metaDescription: string;
  focusKeyword: string;
  ogImage: string;
}

interface Props {
  mode: "create" | "edit";
  initial?: Partial<ArticleFormData>;
  articleId?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const defaultForm: ArticleFormData = {
  title: "",
  slug: "",
  track: "ai-digital-software",
  content: "",
  publishDate: new Date().toISOString().split("T")[0],
  contentType: "core",
  contentForm: "evergreen",
  status: "published",
  scheduledDate: "",
  author: "SinoTechLens",
  sponsored: false,
  metaDescription: "",
  focusKeyword: "",
  ogImage: "",
};

export default function ArticleForm({ mode, initial = {}, articleId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleFormData>({ ...defaultForm, ...initial });
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [open, setOpen] = useState({ publish: true, meta: false, seo: false });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = (snippet: string) => {
    const el = contentRef.current;
    const start = el?.selectionStart ?? form.content.length;
    const end = el?.selectionEnd ?? form.content.length;
    const next = form.content.slice(0, start) + snippet + form.content.slice(end);
    setForm((prev) => ({ ...prev, content: next }));
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        insertAtCursor(`<img src="${data.url}" alt="${file.name}" style="max-width:100%;height:auto;" />`);
      } else {
        alert("Upload failed: " + (data.message || "unknown error"));
      }
    } catch {
      alert("Upload error, please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const insertFromUrl = () => {
    const url = imgUrl.trim();
    if (!url) return;
    insertAtCursor(`<img src="${url}" alt="" style="max-width:100%;height:auto;" />`);
    setImgUrl("");
  };

  const setField = <K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setField("slug", slugify(value));
  };

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-generate slug from title if empty
    let finalSlug = form.slug.trim();
    if (!finalSlug) {
      finalSlug = slugify(form.title);
      setField("slug", finalSlug);
    }
    if (!finalSlug.match(/^[a-z0-9]+(-[a-z0-9]+)*$/)) {
      alert("URL Slug must be lowercase letters, numbers, and hyphens only.");
      return;
    }
    const payloadSlug = finalSlug;

    const text = `${form.title}\n${form.content}`;
    const violations = getHardViolations(text);
    if (violations.length) {
      alert(`${mode === "create" ? "Publish" : "Save"} blocked:\n` + violations.map((v) => `• ${v.rule} (${v.matched})`).join("\n"));
      return;
    }
    const warnings = getSoftWarnings(text);
    if (warnings.length) {
      const ok = confirm("Compliance reminder:\n" + warnings.map((w) => `• ${w.rule}`).join("\n") + "\n\nContinue?");
      if (!ok) return;
    }

    setSaving(true);
    const payload = {
      ...form,
      slug: payloadSlug,
      tags: [],
      scheduledDate: form.scheduledDate || null,
      sponsored: Boolean(form.sponsored),
      seo: { metaDescription: form.metaDescription, focusKeyword: form.focusKeyword, ogImage: form.ogImage },
    };

    try {
      const url = mode === "edit" && articleId ? `/api/articles/${articleId}` : "/api/articles";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        alert(mode === "edit" ? "Article updated!" : "Article created!");
        router.push("/admin/articles");
        router.refresh();
      } else {
        const detail = data.detail ? "\n\nDetails: " + data.detail : "";
        alert("Failed: " + (data.message || "") + detail);
      }
    } catch {
      alert("Network error, please try again.");
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10";
  const label = "block text-sm font-medium text-gray-700 mb-1";
  const select = `${input} bg-white`;

  const Section = ({ title, expanded, onToggle, children }: { title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode }) => (
    <div className="border rounded-lg overflow-hidden">
      <button type="button" onClick={onToggle} className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left">
        <span className="font-medium text-gray-800">{title}</span>
        <span className="text-gray-500 text-sm">{expanded ? "Collapse" : "Expand"}</span>
      </button>
      {expanded && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );

  return (
    <form onSubmit={validateAndSubmit} className="space-y-5 max-w-3xl">
      {/* Main content - always visible */}
      <div className="space-y-4">
        <div>
          <label className={label}>Article Title</label>
          <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className={input} placeholder="e.g. DeepSeek V4: China’s Open-Source Bet" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Track</label>
            <select value={form.track} onChange={(e) => setField("track", e.target.value)} className={select}>
              {TRACKS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>URL Slug <span className="text-gray-400 font-normal">(auto)</span></label>
            <input type="text" value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} className={`${input} font-mono text-sm`} placeholder="Leave empty to auto-generate from title" />
            <p className="text-xs text-gray-500 mt-1">/articles/{form.slug || "..."}</p>
          </div>
        </div>

        <div>
          <label className={label}>Article Content</label>
          {/* Image insertion toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-2 p-2 border rounded-lg bg-gray-50">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1 bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "📷 Upload Image"}
            </button>
            <input
              type="text"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertFromUrl(); } }}
              placeholder="…or paste an image URL"
              className="flex-1 min-w-[160px] border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={insertFromUrl}
              className="border border-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100"
            >
              Insert URL
            </button>
          </div>
          <textarea
            ref={contentRef}
            rows={14}
            value={form.content}
            onChange={(e) => setField("content", e.target.value)}
            className={`${input} font-mono text-sm`}
            placeholder="Paste your article HTML or plain text here... Use the toolbar above to add images."
            required
          />
          <p className="text-xs text-gray-500 mt-1">Accepts HTML. Paste your article body directly, or insert images with the toolbar above.</p>
        </div>
      </div>

      {/* Publishing options */}
      <Section title="Publishing Options" expanded={open.publish} onToggle={() => setOpen((s) => ({ ...s, publish: !s.publish }))}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={label}>Status</label>
            <select value={form.status} onChange={(e) => setField("status", e.target.value as ArticleFormData["status"])} className={select}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className={label}>Publish Date</label>
            <input type="date" value={form.publishDate} onChange={(e) => setField("publishDate", e.target.value)} className={input} required />
          </div>
          <div>
            <label className={label}>Scheduled Date <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="date" value={form.scheduledDate} onChange={(e) => setField("scheduledDate", e.target.value)} className={input} />
          </div>
        </div>
      </Section>

      {/* Metadata */}
      <Section title="Metadata & Classification" expanded={open.meta} onToggle={() => setOpen((s) => ({ ...s, meta: !s.meta }))}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Author</label>
            <input type="text" value={form.author} onChange={(e) => setField("author", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Content Type (70/25/5)</label>
            <select value={form.contentType} onChange={(e) => setField("contentType", e.target.value as ArticleFormData["contentType"])} className={select}>
              <option value="core">Core (70%)</option>
              <option value="supplementary">Supplementary (25%)</option>
              <option value="niche">Niche (5%)</option>
            </select>
          </div>
          <div>
            <label className={label}>Content Form</label>
            <select value={form.contentForm} onChange={(e) => setField("contentForm", e.target.value as ArticleFormData["contentForm"])} className={select}>
              <option value="evergreen">Evergreen (70%)</option>
              <option value="news">News (30%)</option>
            </select>
          </div>
          <label className="flex items-center gap-2 md:pt-6">
            <input type="checkbox" checked={form.sponsored} onChange={(e) => setField("sponsored", e.target.checked)} className="w-4 h-4" />
            <span className="text-sm text-gray-700">Sponsored content</span>
          </label>
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO Settings" expanded={open.seo} onToggle={() => setOpen((s) => ({ ...s, seo: !s.seo }))}>
        <div className="space-y-4">
          <div>
            <label className={label}>Meta Description</label>
            <textarea rows={2} value={form.metaDescription} onChange={(e) => setField("metaDescription", e.target.value)} className={input} placeholder="Shown in Google search results" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Focus Keyword</label>
              <input type="text" value={form.focusKeyword} onChange={(e) => setField("focusKeyword", e.target.value)} className={input} />
            </div>
            <div>
              <label className={label}>OG Image URL</label>
              <input type="text" value={form.ogImage} onChange={(e) => setField("ogImage", e.target.value)} className={input} placeholder="https://..." />
            </div>
          </div>
        </div>
      </Section>

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-60">
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Publish Article"}
        </button>
        <button type="button" onClick={() => router.push("/admin/articles")} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  );
}
