"use client";

import { useCallback, useImperativeHandle, useState, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { pitchFormSchema, type PitchFormInput } from "@/types";
import { DEMO_PITCH } from "@/lib/demo-pitch";

const STEPS = [
  "Validating schema",
  "Running AI Architect",
  "Generating Mermaid Diagram",
  "Saving to MongoDB",
] as const;

export interface PitchFormHandle {
  fillDemo: () => void;
}

const initialForm: PitchFormInput = {
  founder_name: "",
  email: "",
  social_url: "",
  project_title: "",
  target_audience: "",
  problem_statement: "",
  unfair_advantage: "",
  deal_model: "Paid Fast-Track MVP",
  legal_agreed: true,
};

export const PitchForm = forwardRef<PitchFormHandle, object>(function PitchForm(
  _props,
  ref
) {
  const router = useRouter();
  const [form, setForm] = useState<PitchFormInput>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const fillDemo = useCallback(() => {
    setForm({
      founder_name: DEMO_PITCH.founder_name,
      email: DEMO_PITCH.email,
      social_url: DEMO_PITCH.social_url ?? "",
      project_title: DEMO_PITCH.project_title,
      target_audience: DEMO_PITCH.target_audience,
      problem_statement: DEMO_PITCH.problem_statement,
      unfair_advantage: DEMO_PITCH.unfair_advantage,
      deal_model: DEMO_PITCH.deal_model,
      legal_agreed: true,
    });
    setErrors({});
    document.getElementById("pitch-form")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useImperativeHandle(ref, () => ({ fillDemo }), [fillDemo]);

  function updateField<K extends keyof PitchFormInput>(
    key: K,
    value: PitchFormInput[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = pitchFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() ?? "form";
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setStepIndex(0);

    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 1200);

    try {
      const res = await fetch("/api/submit-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg =
          typeof data.error === "string"
            ? data.error
            : data.error?.formErrors?.[0] ?? "Submit failed";
        setErrors({ form: errMsg });
        setLoading(false);
        clearInterval(stepTimer);
        return;
      }
      setStepIndex(STEPS.length - 1);
      router.push(`/pitch/${data.id}`);
    } catch {
      setErrors({ form: "Network error. Please try again." });
      setLoading(false);
      clearInterval(stepTimer);
    }
  }

  const inputClass =
    "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <form
      onSubmit={handleSubmit}
      id="pitch-form"
      className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl"
    >
      <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-emerald-500">
        Structured Pitch Intake
      </h2>
      <p className="mb-6 text-sm text-zinc-400">
        Validated problems only. AI scores feasibility, market pain, and founder fit.
      </p>

      {loading && (
        <div className="mb-6 rounded-lg border border-emerald-900/50 bg-emerald-950/30 p-4">
          <ProgressSteps stepIndex={stepIndex} />
        </div>
      )}

        {errors.form && (
          <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-300">
            <p>{errors.form}</p>
            {errors.form.includes("COHERE_API_KEY") && (
              <p className="mt-2 text-xs text-red-400/90">
                On Vercel: Settings → Environment Variables → add{" "}
                <span className="font-mono text-red-300">COHERE_API_KEY</span> → Redeploy.
              </p>
            )}
            {(errors.form.includes("MONGODB_URI") ||
              errors.form.includes("mongodb+srv") ||
              errors.form.includes("Invalid scheme") ||
              errors.form.includes("Database not configured")) && (
              <p className="mt-2 text-xs text-red-400/90">
                Use the full Atlas connection string (starts with{" "}
                <span className="font-mono text-red-300">mongodb+srv://</span>). Check{" "}
                <span className="font-mono text-red-300">/api/health</span> —{" "}
                <span className="font-mono text-red-300">MONGODB_PING</span> should be{" "}
                <span className="font-mono text-red-300">ok</span>.
              </p>
            )}
          </div>
        )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Founder name" error={errors.founder_name}>
          <input
            className={inputClass}
            value={form.founder_name}
            onChange={(e) => updateField("founder_name", e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field label="LinkedIn / X URL" error={errors.social_url} className="sm:col-span-2">
          <input
            className={inputClass}
            placeholder="https:// (optional)"
            value={form.social_url}
            onChange={(e) => updateField("social_url", e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field label="Project title" error={errors.project_title} className="sm:col-span-2">
          <input
            className={inputClass}
            value={form.project_title}
            onChange={(e) => updateField("project_title", e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field label="Target audience" error={errors.target_audience} className="sm:col-span-2">
          <input
            className={inputClass}
            value={form.target_audience}
            onChange={(e) => updateField("target_audience", e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field
          label="Problem statement (max 600)"
          error={errors.problem_statement}
          className="sm:col-span-2"
        >
          <textarea
            rows={4}
            maxLength={600}
            className={inputClass}
            value={form.problem_statement}
            onChange={(e) => updateField("problem_statement", e.target.value)}
            disabled={loading}
          />
          <span className="mt-1 block text-right font-mono text-xs text-zinc-500">
            {form.problem_statement.length}/600
          </span>
        </Field>
        <Field label="Unfair advantage" error={errors.unfair_advantage} className="sm:col-span-2">
          <textarea
            rows={3}
            className={inputClass}
            value={form.unfair_advantage}
            onChange={(e) => updateField("unfair_advantage", e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field label="Deal model" error={errors.deal_model}>
          <select
            className={inputClass}
            value={form.deal_model}
            onChange={(e) =>
              updateField(
                "deal_model",
                e.target.value as PitchFormInput["deal_model"]
              )
            }
            disabled={loading}
          >
            <option value="Equity Partnership (50/50)">Equity Partnership (50/50)</option>
            <option value="Paid Fast-Track MVP">Paid Fast-Track MVP</option>
          </select>
        </Field>
      </div>

      <label className="interactive-label mt-4 flex items-start gap-3 text-sm text-zinc-400">
        <input
          type="checkbox"
          checked={form.legal_agreed === true}
          onChange={(e) => updateField("legal_agreed", e.target.checked ? true : (false as never))}
          className="mt-1 rounded border-zinc-600"
          disabled={loading}
        />
        <span>
          I acknowledge this submission is non-confidential, does not create a fiduciary
          relationship, and does not guarantee development.
        </span>
      </label>
      {errors.legal_agreed && (
        <p className="mt-1 text-sm text-red-400">{errors.legal_agreed}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Submit for AI Architect Review
      </button>
    </form>
  );
});

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block font-mono text-xs text-zinc-500">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function ProgressSteps({ stepIndex }: { stepIndex: number }) {
  return (
    <ul className="space-y-2">
      {STEPS.map((step, i) => (
        <li
          key={step}
          className={`flex items-center gap-2 font-mono text-xs ${
            i <= stepIndex ? "text-emerald-400" : "text-zinc-600"
          }`}
        >
          {i < stepIndex ? (
            "✓"
          ) : i === stepIndex ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "○"
          )}
          {step}
        </li>
      ))}
    </ul>
  );
}