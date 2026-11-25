import {
  type AIEvaluation,
  aiEvaluationSchema,
  type ReversePitchResult,
  reversePitchResultSchema,
  type PitchFormInput,
  type ReversePitchFormInput,
} from "@/types";
import { cohereJsonChat } from "@/lib/cohere";

const evaluationResponseSchema: Record<string, unknown> = {
  type: "object",
  properties: {
    feasibility_score: { type: "number" },
    market_pain_score: { type: "number" },
    founder_fit_score: { type: "number" },
    overall_score: { type: "number" },
    executive_summary: { type: "string" },
    constructive_feedback: {
      type: "array",
      items: { type: "string" },
    },
    mermaid_diagram: { type: "string" },
    database_schema: { type: "string" },
    sprint_roadmap: {
      type: "object",
      properties: {
        week_1: { type: "array", items: { type: "string" } },
        week_2: { type: "array", items: { type: "string" } },
      },
      required: ["week_1", "week_2"],
    },
  },
  required: [
    "feasibility_score",
    "market_pain_score",
    "founder_fit_score",
    "overall_score",
    "executive_summary",
    "constructive_feedback",
    "mermaid_diagram",
    "database_schema",
    "sprint_roadmap",
  ],
};

const reversePitchResponseSchema: Record<string, unknown> = {
  type: "object",
  properties: {
    recommended_stack: { type: "string" },
    stack_tradeoffs: {
      type: "array",
      items: { type: "string" },
    },
    edge_cases_security: {
      type: "array",
      items: { type: "string" },
    },
    seven_day_plan: {
      type: "object",
      properties: {
        day_1: { type: "string" },
        day_2: { type: "string" },
        day_3: { type: "string" },
        day_4: { type: "string" },
        day_5: { type: "string" },
        day_6: { type: "string" },
        day_7: { type: "string" },
      },
      required: [
        "day_1",
        "day_2",
        "day_3",
        "day_4",
        "day_5",
        "day_6",
        "day_7",
      ],
    },
    architecture_summary: { type: "string" },
  },
  required: [
    "recommended_stack",
    "stack_tradeoffs",
    "edge_cases_security",
    "seven_day_plan",
    "architecture_summary",
  ],
};

export function estimateTokensAndCost(
  prompt: string,
  response: string
): { tokens: number; costUsd: number } {
  const chars = prompt.length + response.length;
  const tokens = Math.ceil(chars / 4);
  const costUsd = (tokens / 1_000_000) * 0.25;
  return { tokens, costUsd };
}

export async function evaluatePitch(
  pitch: PitchFormInput
): Promise<{ evaluation: AIEvaluation; raw: string; prompt: string }> {
  const userPrompt = `You are a ruthless Y Combinator Technical Co-Founder evaluating startup pitches.
Score harshly but constructively.

Pitch data:
${JSON.stringify(pitch, null, 2)}

Rules for mermaid_diagram:
- Must start with "graph TD"
- Use simple node IDs like A, B, C1 without special characters in IDs
- Put human-readable labels in brackets or parentheses only
- Represent the recommended MVP system architecture

Rules for database_schema:
- Single PostgreSQL CREATE TABLE snippet suitable for Supabase
- Include primary keys and sensible types

Rules for sprint_roadmap:
- week_1 and week_2 are arrays of concrete engineering tasks for a solo dev 14-day sprint
- constructive_feedback must have exactly 3 sharp bullet points`;

  const { raw, prompt } = await cohereJsonChat(
    userPrompt,
    evaluationResponseSchema
  );
  const parsed = JSON.parse(raw) as unknown;
  const evaluation = aiEvaluationSchema.parse(parsed);
  return { evaluation, raw, prompt };
}

export async function generateReversePitch(
  input: ReversePitchFormInput
): Promise<{ result: ReversePitchResult; raw: string; prompt: string }> {
  const userPrompt = `You are a senior full-stack engineer pitching how you would architect and ship a feature in 7 days.
Company: ${input.company_name}
Product: ${input.product_url_or_description}
Challenge: ${input.feature_challenge}

Be specific about stack, trade-offs, security, and a day-by-day plan.`;

  const { raw, prompt } = await cohereJsonChat(
    userPrompt,
    reversePitchResponseSchema
  );
  const parsed = JSON.parse(raw) as unknown;
  const reverseResult = reversePitchResultSchema.parse(parsed);
  return { result: reverseResult, raw, prompt };
}