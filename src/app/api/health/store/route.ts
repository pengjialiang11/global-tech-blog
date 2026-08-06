import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { readJson, useGitHub } from "@/lib/store";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const configured = useGitHub();
    const articles = await readJson("src/data/articles.json");
    return NextResponse.json({
      success: true,
      githubStore: configured,
      repo: process.env.GITHUB_REPO || null,
      branch: process.env.GITHUB_BRANCH || "main",
      tokenConfigured: Boolean(process.env.GITHUB_TOKEN),
      articlesCount: Array.isArray(articles) ? articles.length : "invalid",
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        githubStore: useGitHub(),
        repo: process.env.GITHUB_REPO || null,
        branch: process.env.GITHUB_BRANCH || "main",
        tokenConfigured: Boolean(process.env.GITHUB_TOKEN),
        detail,
      },
      { status: 500 }
    );
  }
}
