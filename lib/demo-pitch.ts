import type { PitchFormInput } from "@/types";

export const DEMO_PITCH: Omit<PitchFormInput, "legal_agreed"> & {
  legal_agreed?: boolean;
} = {
  founder_name: "Jordan Lee",
  email: "jordan@acmecorp-demo.example",
  social_url: "https://www.linkedin.com/in/jordanlee",
  project_title: "FlowMetrics AI — RevOps Copilot for B2B SaaS",
  target_audience: "VP Sales & RevOps at Series A–C B2B SaaS (50–500 employees)",
  problem_statement:
    "RevOps teams drown in Salesforce hygiene work. CRM data decays within 72 hours; forecast commits miss by 20%+. Existing tools auto-log emails but miss the unstructured Slack and Gong insights that actually drive pipeline truth.",
  unfair_advantage:
    "2,400-person waitlist from RevOps community newsletter; founder ex-Salesforce PM with 6 design partners paying $500/mo for manual concierge before product.",
  deal_model: "Equity Partnership (50/50)",
  legal_agreed: true,
};