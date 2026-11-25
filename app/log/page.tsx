import Link from "next/link";
import { FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ChangelogView } from "@/components/ChangelogView";
import { CHANGELOG } from "@/lib/site-content";

export const metadata = {
  title: "Project log — BuildWithMe Studio",
  description: "Release history and notable changes.",
};

export default function LogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald-500">
          Project log
        </p>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-zinc-50">
          <FileText className="h-8 w-8 text-emerald-500" />
          Changelog
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Shipping history for BuildWithMe Studio. Also tracked in{" "}
          <code className="text-zinc-400">CHANGELOG.md</code> in the repo.
        </p>
        <div className="mt-10">
          <ChangelogView entries={CHANGELOG} />
        </div>
        <nav className="mt-10 flex justify-center gap-6 text-sm">
          <Link href="/" className="text-emerald-400 hover:underline">
            ← Home
          </Link>
          <Link href="/about" className="text-zinc-400 hover:text-emerald-400">
            About
          </Link>
        </nav>
      </main>
    </div>
  );
}