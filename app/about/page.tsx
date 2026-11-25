import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AboutSection } from "@/components/AboutSection";

export const metadata = {
  title: "About — BuildWithMe Studio",
  description: "Mission, audience, and stack for BuildWithMe Studio.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <AboutSection />
        <nav className="mt-8 flex justify-center gap-6 text-sm">
          <Link href="/" className="text-emerald-400 hover:underline">
            ← Home
          </Link>
          <Link href="/log" className="text-zinc-400 hover:text-emerald-400">
            Project log
          </Link>
        </nav>
      </main>
    </div>
  );
}