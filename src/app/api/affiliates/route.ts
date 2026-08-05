import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAffiliates, getAllAffiliates, saveAffiliates, type Affiliate } from "@/lib/affiliateData";
import { requireAuth } from "@/lib/api-auth";

// GET: public returns only Active links; ?all=true requires auth
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get("track") || undefined;
    const all = searchParams.get("all") === "true";

    if (all) {
      const authError = await requireAuth(request);
      if (authError) return authError;
    }

    const list = all ? getAllAffiliates() : getAffiliates(track);
    return NextResponse.json({ success: true, affiliates: list });
  } catch (error) {
    console.error("Failed to fetch affiliates:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch affiliates" }, { status: 500 });
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
    const list = getAllAffiliates();
    const newItem: Affiliate = {
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
    saveAffiliates(list);
    return NextResponse.json({ success: true, affiliate: newItem });
  } catch (error) {
    console.error("Failed to create affiliate:", error);
    return NextResponse.json({ success: false, message: "Failed to create affiliate" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });
    const list = getAllAffiliates();
    const idx = list.findIndex((a) => a.id === body.id);
    if (idx === -1) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    list[idx] = { ...list[idx], ...body };
    saveAffiliates(list);
    return NextResponse.json({ success: true, affiliate: list[idx] });
  } catch (error) {
    console.error("Failed to update affiliate:", error);
    return NextResponse.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "id required" }, { status: 400 });
    const list = getAllAffiliates().filter((a) => a.id !== id);
    saveAffiliates(list);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete affiliate:", error);
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}
