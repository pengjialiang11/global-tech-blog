import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { requireAuth } from "@/lib/api-auth";
import { saveFile } from "@/lib/store";

// Image upload for article content. Auth-gated (admin only).
// In dev it writes to public/uploads/; in production (Vercel) it commits the
// file to the GitHub repo via the store, then it is served as a static asset.
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Only image files are allowed" }, { status: 415 });
    }

    const MAX_BYTES = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: "Image too large (max 5MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    const rel = `public/uploads/${Date.now()}-${safeName}`;
    const url = await saveFile(rel, buffer);
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Upload failed:", error);
    return NextResponse.json({ success: false, message: error?.message || "Upload failed" }, { status: 500 });
  }
}
