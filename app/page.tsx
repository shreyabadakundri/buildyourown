"use client";

import { useRef } from "react";
import { ArrowRight, Cpu, FileInput, Rocket } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PitchForm, type PitchFormHandle } from "@/components/PitchForm";

const STEPS = [
  {
    icon: FileInput,
    title: "Structured Pitch Intake",
    desc: "Zod-validated founder data, problem, and unfair advantage—no vague decks.",
  },
  {
    icon: Cpu,
    title: "Autonomous AI Architect",
    desc: "Gemini scores feasibility, market pain, and fit; outputs architecture + SQL.",
  },
  {
    icon: Rocket,
    title: "Blueprint + 14-Day Sprint",
    desc: "Shareable results page, Mermaid diagram, and a concrete two-week roadmap.",
  },
];

export default function HomePage() {
  const pitchRef = useRef<PitchFormHandle>(null);

  return (
    <div className="min-h-screen">
      <Navbar onDemoMode={() => pitchRef.current?.fillDemo()} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12">
        <section className="mb-16 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-emerald-500">
            Autonomous AI Venture Studio
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            You Bring the Validated Problem.{" "}
            <span className="text-emerald-400">My AI Architects It.</span> I Ship the MVP in
            14 Days.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-zinc-400">
            Automated technical screening plus solo-developer execution. Founders get instant
            feedback; recruiters get a live engineering proof-of-work pipeline.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center font-mono text-sm uppercase tracking-widest text-zinc-500">
            How It Works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} />
            ))}
          </div>
        </section>

        <section>
          <PitchForm ref={pitchRef} />
        </section>

        <footer className="mt-16 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-600">
          BuildWithMe Studio — engineering proof-of-work by a solo full-stack developer.
        </footer>
      </main>
    </div>
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const Icon = step.icon;
  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
      {index < STEPS.length - 1 && (
        <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-zinc-700 md:block" />
      )}
      <div className="mb-4 inline-flex rounded-lg border border-zinc-700 bg-zinc-950 p-2">
        <Icon className="h-5 w-5 text-emerald-400" />
      </div>
      <h3 className="font-semibold text-zinc-100">{step.title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{step.desc}</p>
    </div>
  );
}