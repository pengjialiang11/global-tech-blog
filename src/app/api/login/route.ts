import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  
  const ADMIN_USER = process.env.ADMIN_USER || "admin";
  const ADMIN_PASS = process.env.ADMIN_PASS || "TechLens2026";

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json(
      { msg: "Incorrect username or password" },
      { status: 400 }
    );
  }

  const token = "admin-token-2026-sinotechlens-global-tech-blog";
  return NextResponse.json({ token });
}