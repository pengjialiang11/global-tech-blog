import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { readJson, writeJson } from "@/lib/store";
import { requireAuth } from "@/lib/api-auth";

const AFFILIATES_PATH = "src/data/affiliates.json";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get("track") || undefined;
    const all = searchParams.get("all") === "true";

    if (all) {
      const authError = await requireAuth(request);
      if (authError) return authError;
    }

    const list = await readJson(AFFILIATES_PATH);
    const active = list.filter((a: any) => a.status === "Active");
    const filtered = track ? active.filter((a: any) => a.track === track) : active;
    return NextResponse.json({ success: true, affiliates: all ? list : filtered });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch affiliates:", detail);
    return NextResponse.json({ success: false, message: "Failed to fetch affiliates", detail }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    if (!body.name || !body.targetUrl) {
      return NextResponse.json({ success: false, message: "Name and target URL are required" }, { status: 400 });
    }
    const list = await readJson(AFFILIATES_PATH);
    const newItem = {
      id: `aff-${Date.now()}`,
      name: body.name,
      track: body.track || "ai-digital-software",
      note: body.note || "",
      targetUrl: body.targetUrl,
      status: body.status || "Active",
      commission: body.commission || "",
      featured: Boolean(body.featured),
    };
    list.push(newItem);
    await writeJson(AFFILIATES_PATH, list);
    return NextResponse.json({ success: true, affiliate: newItem });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Failed to create affiliate:", detail);
    return NextResponse.json({ success: false, message: "Failed to create affiliate", detail }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });
    const list = await readJson(AFFILIATES_PATH);
    const idx = list.findIndex((a: any) => a.id === body.id);
    if (idx === -1) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    list[idx] = { ...list[idx], ...body };
    await writeJson(AFFILIATES_PATH, list);
    return NextResponse.json({ success: true, affiliate: list[idx] });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Failed to update affiliate:", detail);
    return NextResponse.json({ success: false, message: "Failed to update", detail }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });
    const list = await readJson(AFFILIATES_PATH);
    const next = list.filter((a: any) => a.id !== id);
    if (next.length === list.length) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    await writeJson(AFFILIATES_PATH, next);
    return NextResponse.json({ success: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Failed to delete affiliate:", detail);
    return NextResponse.json({ success: false, message: "Failed to delete", detail }, { status: 500 });
  }
}
