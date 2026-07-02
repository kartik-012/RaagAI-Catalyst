import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Call pollinations API from the server to bypass browser Cloudflare Turnstile limits
    const encodedTopic = encodeURIComponent(`Write a detailed system prompt for ${topic}. Return only the prompt text.`);
    const res = await fetch(`https://text.pollinations.ai/${encodedTopic}`);
    
    if (!res.ok) {
      throw new Error(`Pollinations API error: ${res.status}`);
    }

    const text = await res.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Generate prompt error:", error);
    return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });
  }
}
