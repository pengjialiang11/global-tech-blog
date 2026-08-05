import fs from "fs";
import path from "path";

// GitHub-backed content storage.
//
// WHY: On Vercel (and most serverless platforms) the runtime filesystem is
// READ-ONLY, so writing articles.json / affiliates.json / uploaded images via
// fs.writeFileSync silently fails (500). This module makes the admin work by
// persisting changes to the GitHub repository (which triggers a Vercel rebuild
// and keeps the published site in sync). In local dev (no GITHUB_TOKEN set) it
// falls back to plain file reads/writes so the dev loop stays fast.

const REPO = process.env.GITHUB_REPO; // e.g. "pengjialiang11/global-tech-blog"
const TOKEN = process.env.GITHUB_TOKEN; // fine-grained PAT with Contents: Read/Write
const BRANCH = process.env.GITHUB_BRANCH || "main";

export function useGitHub(): boolean {
  return Boolean(REPO && TOKEN);
}

function absPath(rel: string): string {
  return path.resolve(process.cwd(), rel);
}

interface GhContent {
  content: string; // base64
  sha: string;
}

async function ghGet(rel: string): Promise<GhContent> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${rel}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "sinotechlens-cms",
      },
    }
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub GET ${rel} failed: ${res.status} ${t}`);
  }
  const data = (await res.json()) as { content: string; sha: string };
  return { content: data.content, sha: data.sha };
}

async function ghPut(
  rel: string,
  base64: string,
  sha: string | undefined,
  message: string
): Promise<void> {
  const body: Record<string, unknown> = { message, content: base64, branch: BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${rel}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "sinotechlens-cms",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub PUT ${rel} failed: ${res.status} ${t}`);
  }
}

/** Read & parse a JSON file (repo-relative path, e.g. "src/data/articles.json"). */
export async function readJson(rel: string): Promise<any> {
  if (useGitHub()) {
    const { content } = await ghGet(rel);
    return JSON.parse(Buffer.from(content, "base64").toString("utf8"));
  }
  return JSON.parse(fs.readFileSync(absPath(rel), "utf8"));
}

/** Write a JSON-serialisable value back to the file. */
export async function writeJson(rel: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  if (useGitHub()) {
    let sha: string | undefined;
    try {
      const cur = await ghGet(rel);
      sha = cur.sha;
    } catch {
      // file does not exist yet — create it
    }
    await ghPut(rel, Buffer.from(json, "utf8").toString("base64"), sha, `chore: update ${rel} via admin`);
    return;
  }
  fs.writeFileSync(absPath(rel), json);
}

/**
 * Persist an uploaded binary (image). The `rel` path is repo-relative,
 * e.g. "public/uploads/1690000000-photo.png". Returns the public URL "/uploads/...".
 */
export async function saveFile(rel: string, buffer: Buffer): Promise<string> {
  if (useGitHub()) {
    let sha: string | undefined;
    try {
      const cur = await ghGet(rel);
      sha = cur.sha;
    } catch {
      // create new
    }
    await ghPut(rel, buffer.toString("base64"), sha, `add ${rel} via admin`);
    return "/" + rel.replace(/^public\//, "");
  }
  const full = absPath(rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, buffer);
  return "/" + rel.replace(/^public\//, "");
}
