import { NextResponse } from "next/server";
import { reversePitchFormSchema } from "@/types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { generateReversePitch, estimateTokensAndCost } from "@/lib/gemini";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reversePitchFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const { result, raw, prompt } = await generateReversePitch(parsed.data);
    const { tokens, costUsd } = estimateTokensAndCost(prompt, raw);
    return NextResponse.json({
      result,
      telemetry: { tokens_estimated: tokens, cost_usd: costUsd },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}