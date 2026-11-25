import type { ChangelogEntry } from "@/lib/site-content";

export function ChangelogView({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <div className="space-y-10">
      {entries.map((entry) => (
        <article
          key={entry.version}
          className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
            <h2 className="font-mono text-lg font-semibold text-emerald-400">
              v{entry.version}
            </h2>
            <time className="font-mono text-xs text-zinc-500">{entry.date}</time>
          </header>
          <div className="mt-4 space-y-4">
            {entry.sections.map((section) => (
              <div key={section.title}>
                <h3 className="font-mono text-xs uppercase tracking-wide text-zinc-500">
                  {section.title}
                </h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-400">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}