import { notFound } from "next/navigation";
import Link from "next/link";
import { getPitchById } from "@/lib/db/pitches";
import {
  aiEvaluationSchema,
  telemetrySchema,
  type AIEvaluation,
  type Telemetry,
} from "@/types";
import { MermaidChart } from "@/components/MermaidChart";
import { SqlBlock } from "@/components/SqlBlock";
import { TelemetryDrawer } from "@/components/TelemetryDrawer";
import { OverallBadge, ScoreBar } from "@/components/ScoreBadge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PitchResultPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getPitchById(id);
  if (!data) notFound();

  let evaluation: AIEvaluation;
  let telemetry: Telemetry;
  try {
    evaluation = aiEvaluationSchema.parse(data.ai_evaluation);
    telemetry = telemetrySchema.parse(data.telemetry);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 px-4 py-4">
        <PitchHeader projectTitle={data.project_title as string} />
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">{data.project_title}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {data.founder_name} · {data.deal_model}
            </p>
          </div>
          <OverallBadge score={evaluation.overall_score} />
        </div>

        <p className="text-lg text-zinc-300">{evaluation.executive_summary}</p>

        <ScoreGrid evaluation={evaluation} />

        <section>
          <h2 className="mb-3 font-mono text-xs uppercase text-emerald-500">
            Constructive feedback
          </h2>
          <ul className="space-y-2">
            {evaluation.constructive_feedback.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-xs uppercase text-emerald-500">
            System architecture
          </h2>
          <MermaidChart diagram={evaluation.mermaid_diagram} />
        </section>

        <section>
          <h2 className="mb-3 font-mono text-xs uppercase text-emerald-500">
            PostgreSQL schema
          </h2>
          <SqlBlock sql={evaluation.database_schema} />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <RoadmapCard title="Week 1" items={evaluation.sprint_roadmap.week_1} />
          <RoadmapCard title="Week 2" items={evaluation.sprint_roadmap.week_2} />
        </section>
      </main>

      <TelemetryDrawer
        telemetry={telemetry}
        projectTitle={data.project_title as string}
      />
    </div>
  );
}

function PitchHeader({ projectTitle }: { projectTitle: string }) {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-between">
      <Link href="/" className="font-mono text-sm text-emerald-400 hover:underline">
        ← BuildWithMe.dev
      </Link>
      <span className="truncate font-mono text-xs text-zinc-600">{projectTitle}</span>
    </div>
  );
}

function ScoreGrid({ evaluation }: { evaluation: AIEvaluation }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <ScoreBar label="Feasibility" score={evaluation.feasibility_score} />
      <ScoreBar label="Market pain" score={evaluation.market_pain_score} />
      <ScoreBar label="Founder fit" score={evaluation.founder_fit_score} />
    </div>
  );
}

function RoadmapCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="font-mono text-sm font-semibold text-emerald-400">{title}</h3>
      <ul className="mt-4 space-y-2">
        {items.map((task) => (
          <li key={task} className="flex gap-2 text-sm text-zinc-300">
            <span className="text-zinc-600">□</span>
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}