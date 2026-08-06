import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { readJson, writeJson } from "@/lib/store";
import { getHardViolations } from "@/lib/compliance";
import { requireAuth } from "@/lib/api-auth";

const ARTICLES_PATH = "src/data/articles.json";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const articles = await readJson(ARTICLES_PATH);
    const article = articles.find((art: any) => art.id === id);
    if (!article) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.slug !== undefined) {
      const cleanSlug = String(body.slug).toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      if (!cleanSlug.match(/^[a-z0-9]+(-[a-z0-9]+)*$/)) {
        return NextResponse.json({ success: false, message: "Invalid slug." }, { status: 400 });
      }
      body.slug = cleanSlug;
    }

    const hard = getHardViolations(`${body.title || ""}\n${body.content || ""}`);
    if (hard.length) {
      return NextResponse.json({ success: false, message: "Blocked by compliance", violations: hard }, { status: 422 });
    }

    const articles = await readJson(ARTICLES_PATH);
    const index = articles.findIndex((art: any) => art.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    if (body.content) {
      const plainText = body.content.replace(/<[^>]+>/g, " ").replace(/[#*`\n]/g, " ").trim();
      body.description = plainText.slice(0, 120) + "...";
    }

    const merged = {
      ...articles[index],
      ...body,
      seo: body.seo || articles[index].seo || {},
    };
    articles[index] = merged;
    await writeJson(ARTICLES_PATH, articles);
    return NextResponse.json({ success: true, article: articles[index] });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Failed to update article:", detail);
    return NextResponse.json({ success: false, message: "Failed to update article", detail }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const articles = await readJson(ARTICLES_PATH);
    const filteredArticles = articles.filter((art: any) => art.id !== id);
    if (filteredArticles.length === articles.length) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }
    await writeJson(ARTICLES_PATH, filteredArticles);
    return NextResponse.json({ success: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Failed to delete article:", detail);
    return NextResponse.json({ success: false, message: "Failed to delete article", detail }, { status: 500 });
  }
}
