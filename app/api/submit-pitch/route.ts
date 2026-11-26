import { NextResponse } from "next/server";
import { pitchFormSchema, type Telemetry } from "@/types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { evaluatePitch, estimateTokensAndCost } from "@/lib/gemini";
import { sendPitchEmails } from "@/lib/resend";
import { insertPitch, updatePitchTelemetry } from "@/lib/db/pitches";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(ip);

  if (!rate.allowed) {
    const telemetry: Telemetry = {
      validation_ms: 0,
      ai_inference_ms: 0,
      db_write_ms: 0,
      email_ms: 0,
      tokens_estimated: 0,
      cost_usd: 0,
      zod_valid: false,
      rate_limit_ok: false,
    };
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later.", telemetry },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tValStart = Date.now();
  const parsed = pitchFormSchema.safeParse(body);
  const validation_ms = Date.now() - tValStart;

  if (!parsed.success) {
    const telemetry: Telemetry = {
      validation_ms,
      ai_inference_ms: 0,
      db_write_ms: 0,
      email_ms: 0,
      tokens_estimated: 0,
      cost_usd: 0,
      zod_valid: false,
      rate_limit_ok: true,
    };
    return NextResponse.json(
      { error: parsed.error.flatten(), telemetry },
      { status: 400 }
    );
  }

  const pitch = parsed.data;

  const tAiStart = Date.now();
  let evaluation;
  let tokens_estimated = 0;
  let cost_usd = 0;
  try {
    const ai = await evaluatePitch(pitch);
    evaluation = ai.evaluation;
    const est = estimateTokensAndCost(ai.prompt, ai.raw);
    tokens_estimated = est.tokens;
    cost_usd = est.costUsd;
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI evaluation failed";
    const hint =
      message.includes("COHERE_API_KEY") || message.includes("not configured")
        ? "Set COHERE_API_KEY in .env.local and restart dev server, or in Vercel env vars and redeploy."
        : message;
    return NextResponse.json({ error: hint }, { status: 503 });
  }
  const ai_inference_ms = Date.now() - tAiStart;

  const telemetryBase: Omit<Telemetry, "email_ms" | "db_write_ms"> = {
    validation_ms,
    ai_inference_ms,
    tokens_estimated,
    cost_usd,
    zod_valid: true,
    rate_limit_ok: true,
  };

  const tDbStart = Date.now();
  let id: string;
  try {
    id = await insertPitch(pitch, evaluation, {
      ...telemetryBase,
      db_write_ms: 0,
      email_ms: 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save pitch";
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
  const db_write_ms = Date.now() - tDbStart;

  const tEmailStart = Date.now();
  try {
    await sendPitchEmails(pitch, evaluation);
  } catch (e) {
    console.warn("[BuildWithMe] Email send failed:", e);
  }
  const email_ms = Date.now() - tEmailStart;

  const telemetry: Telemetry = {
    ...telemetryBase,
    db_write_ms,
    email_ms,
  };

  try {
    await updatePitchTelemetry(id, telemetry);
  } catch (e) {
    console.warn("[BuildWithMe] Telemetry update failed:", e);
  }

  return NextResponse.json({
    id,
    evaluation,
    telemetry,
  });
}