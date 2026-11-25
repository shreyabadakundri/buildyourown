export const ABOUT = {
  title: "About BuildWithMe Studio",
  tagline: "AI venture studio + engineering proof-of-work",
  paragraphs: [
    "BuildWithMe Studio is a solo-developer venture studio that automates technical screening for founders and gives recruiters a live look at how ideas get architected and shipped.",
    "Founders submit a structured, non-confidential pitch. Cohere acts as a ruthless technical co-founder: scores, architecture diagram, MVP database sketch, and a 14-day engineering roadmap—stored in MongoDB Atlas (or local file store in dev).",
    "Recruiters and CTOs can use Reverse Pitch: describe a feature challenge and get a concrete 7-day execution plan. Everything is measurable—latency telemetry is visible on every result page.",
  ],
  audience: [
    "Founders with a validated problem and clear unfair advantage",
    "Hiring teams evaluating full-stack + AI integration skills",
    "Indie operators running equity or paid fast-track MVPs",
  ],
  stack: [
    "Next.js 14 · TypeScript · Tailwind",
    "Cohere · MongoDB Atlas",
    "Mermaid · Zod · Resend",
  ],
  repoUrl: "https://github.com/shreyabadakundri/buildyourown",
};

export interface ChangelogEntry {
  version: string;
  date: string;
  sections: {
    title: "Added" | "Changed" | "Fixed" | "Removed";
    items: string[];
  }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.1.0",
    date: "2026-03-25",
    sections: [
      {
        title: "Added",
        items: [
          "About page and homepage About section",
          "In-app project log at /log",
          "Navbar links for About and Log",
        ],
      },
      {
        title: "Changed",
        items: ['Homepage pipeline copy references Cohere AI architect'],
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-03-25",
    sections: [
      {
        title: "Added",
        items: [
          "Structured pitch intake and /api/submit-pitch",
          "Shareable /pitch/[id] results with telemetry drawer",
          "Reverse-pitch modal and admin dashboard",
          "MongoDB Atlas + local dev fallback",
          "GitHub: shreyabadakundri/buildyourown",
        ],
      },
    ],
  },
];