import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // Follow redirects to get the final URL (which contains coordinates)
    const response = await fetch(url, { redirect: "follow" });
    const finalUrl = response.url;

    return NextResponse.json({ resolvedUrl: finalUrl });
  } catch {
    return NextResponse.json({ error: "Failed to resolve URL" }, { status: 500 });
  }
}
