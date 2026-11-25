"use client";

import { useEffect, useId, useState } from "react";

interface MermaidChartProps {
  diagram: string;
}

export function MermaidChart({ diagram }: MermaidChartProps) {
  const id = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function render() {
      setError(null);
      setSvg("");
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
        });
        const { svg: rendered } = await mermaid.render(`mmd-${id}`, diagram);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to render diagram");
        }
      }
    }
    if (diagram?.trim()) void render();
    return () => {
      cancelled = true;
    };
  }, [diagram, id]);

  if (error) {
    return (
      <div className="rounded-lg border border-amber-900/50 bg-zinc-900 p-4">
        <p className="mb-2 text-sm text-amber-400">Could not render diagram. Raw Mermaid:</p>
        <pre className="overflow-x-auto font-mono text-xs text-zinc-400">{diagram}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-500">
        Rendering architecture…
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 [&_svg]:mx-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}