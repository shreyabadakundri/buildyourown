import Link from "next/link";
import { Code2, Target, Users, Wrench } from "lucide-react";
import { ABOUT } from "@/lib/site-content";

export function AboutSection() {
  return (
    <section
      id="about"
      className="mb-16 scroll-mt-24 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 md:p-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-500">
            About
          </p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-50">{ABOUT.title}</h2>
          <p className="mt-1 font-mono text-sm text-zinc-500">{ABOUT.tagline}</p>
        </div>
        <a
          href={ABOUT.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:border-emerald-600 hover:text-emerald-400"
        >
          <Code2 className="h-4 w-4" />
          Source on GitHub
        </a>
      </div>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-400">
        {ABOUT.paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="mb-3 flex items-center gap-2 text-emerald-400">
            <Users className="h-4 w-4" />
            <h3 className="font-mono text-xs uppercase tracking-wide">Who it&apos;s for</h3>
          </div>
          <ul className="space-y-2 text-sm text-zinc-400">
            {ABOUT.audience.map((item) => (
              <li key={item} className="flex gap-2">
                <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="mb-3 flex items-center gap-2 text-emerald-400">
            <Wrench className="h-4 w-4" />
            <h3 className="font-mono text-xs uppercase tracking-wide">Stack</h3>
          </div>
          <ul className="flex flex-wrap gap-2">
            {ABOUT.stack.map((item) => (
              <li
                key={item}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-600">
        <Link href="/about" className="text-emerald-500 hover:underline">
          Read full about page
        </Link>
        {" · "}
        <Link href="/log" className="text-emerald-500 hover:underline">
          Project log
        </Link>
      </p>
    </section>
  );
}