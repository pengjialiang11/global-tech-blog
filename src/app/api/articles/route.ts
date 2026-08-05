import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { readJson, writeJson } from "@/lib/store";
import { getHardViolations } from "@/lib/compliance";
import { requireAuth } from "@/lib/api-auth";

const ARTICLES_PATH = "src/data/articles.json";

function isPublic(a: any, now = Date.now()): boolean {
  if (a.status && a.status !== "published") return false;
  if (a.scheduledDate) {
    const t = new Date(a.scheduledDate).getTime();
    if (!Number.isNaN(t) && t > now) return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    // Drafts and hidden data require authentication
    if (includeDrafts) {
      const authError = await requireAuth(request);
      if (authError) return authError;
    }

    const articles = await readJson(ARTICLES_PATH);
    const filtered = includeDrafts ? articles : articles.filter((a: any) => isPublic(a));
    filtered.sort(
      (a: any, b: any) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
    return NextResponse.json({ success: true, articles: filtered });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ success: false, message: "Title, slug and content are required" }, { status: 400 });
    }

    const cleanSlug = String(body.slug).toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (!cleanSlug.match(/^[a-z0-9]+(-[a-z0-9]+)*$/)) {
      return NextResponse.json({ success: false, message: "Invalid slug." }, { status: 400 });
    }

    const hard = getHardViolations(`${body.title}\n${body.content}`);
    if (hard.length) {
      return NextResponse.json({
        success: false,
        message: "Blocked by compliance: " + hard.map((h) => h.rule).join(", "),
        violations: hard,
      }, { status: 422 });
    }

    if (!body.description) {
      const plainText = body.content.replace(/<[^>]+>/g, " ").replace(/[#*`\n]/g, " ").trim();
      body.description = plainText.slice(0, 120) + "...";
    }

    const articles = await readJson(ARTICLES_PATH);

    const newArticle = {
      id: String(Date.now()),
      slug: cleanSlug,
      title: body.title.trim(),
      track: body.track || "ai-digital-software",
      description: body.description,
      content: body.content,
      publishDate: body.publishDate || new Date().toISOString().split("T")[0],
      contentType: body.contentType || "core",
      contentForm: body.contentForm || "evergreen",
      tags: body.tags || [],
      status: body.status || "published",
      scheduledDate: body.scheduledDate || null,
      author: body.author || "SinoTechLens",
      sponsored: Boolean(body.sponsored),
      seo: body.seo || { metaDescription: body.metaDescription, focusKeyword: body.focusKeyword, ogImage: body.ogImage },
    };

    articles.unshift(newArticle);
    await writeJson(ARTICLES_PATH, articles);
    return NextResponse.json({ success: true, article: newArticle });
  } catch (error) {
    console.error("Failed to create article:", error);
    return NextResponse.json({ success: false, message: "Failed to create article" }, { status: 500 });
  }
}
