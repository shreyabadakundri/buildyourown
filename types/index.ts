import { z } from "zod";

export const pitchFormSchema = z.object({
  founder_name: z.string().min(1, "Founder name is required"),
  email: z.string().email("Valid email required"),
  social_url: z.union([z.string().url("Must be a valid URL"), z.literal("")]),
  project_title: z.string().min(1, "Project title is required"),
  target_audience: z.string().min(1, "Target audience is required"),
  problem_statement: z
    .string()
    .min(10, "Problem statement required")
    .max(600, "Max 600 characters"),
  unfair_advantage: z.string().min(1, "Unfair advantage is required"),
  deal_model: z.enum(["Equity Partnership (50/50)", "Paid Fast-Track MVP"]),
  legal_agreed: z.literal(true, {
    message: "You must acknowledge the legal notice",
  }),
});

export type PitchFormInput = z.infer<typeof pitchFormSchema>;

export const sprintRoadmapSchema = z.object({
  week_1: z.array(z.string()),
  week_2: z.array(z.string()),
});

export const aiEvaluationSchema = z.object({
  feasibility_score: z.number().min(1).max(10),
  market_pain_score: z.number().min(1).max(10),
  founder_fit_score: z.number().min(1).max(10),
  overall_score: z.number().min(1).max(10),
  executive_summary: z.string(),
  constructive_feedback: z.array(z.string()).min(1).max(5),
  mermaid_diagram: z.string(),
  database_schema: z.string(),
  sprint_roadmap: sprintRoadmapSchema,
});

export type AIEvaluation = z.infer<typeof aiEvaluationSchema>;

export const telemetrySchema = z.object({
  validation_ms: z.number(),
  ai_inference_ms: z.number(),
  db_write_ms: z.number(),
  email_ms: z.number(),
  tokens_estimated: z.number(),
  cost_usd: z.number(),
  zod_valid: z.boolean(),
  rate_limit_ok: z.boolean(),
});

export type Telemetry = z.infer<typeof telemetrySchema>;

export type PitchStatus = "New" | "Call Booked" | "Building" | "Archived";

export interface PitchRecord {
  id: string;
  created_at: string;
  updated_at: string;
  founder_name: string;
  email: string;
  social_url: string | null;
  project_title: string;
  target_audience: string;
  problem_statement: string;
  unfair_advantage: string;
  deal_model: string;
  legal_agreed: boolean;
  ai_evaluation: AIEvaluation;
  telemetry: Telemetry;
  status: PitchStatus;
}

export const reversePitchFormSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  product_url_or_description: z.string().min(10, "Describe the product"),
  feature_challenge: z.string().min(10, "Describe the feature challenge"),
});

export type ReversePitchFormInput = z.infer<typeof reversePitchFormSchema>;

export const reversePitchResultSchema = z.object({
  recommended_stack: z.string(),
  stack_tradeoffs: z.array(z.string()),
  edge_cases_security: z.array(z.string()),
  seven_day_plan: z.object({
    day_1: z.string(),
    day_2: z.string(),
    day_3: z.string(),
    day_4: z.string(),
    day_5: z.string(),
    day_6: z.string(),
    day_7: z.string(),
  }),
  architecture_summary: z.string(),
});

export type ReversePitchResult = z.infer<typeof reversePitchResultSchema>;

export interface SubmitPitchResponse {
  id: string;
  evaluation: AIEvaluation;
  telemetry: Telemetry;
}