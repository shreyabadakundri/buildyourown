# BuildWithMe Studio

**Repository:** [github.com/shreyabadakundri/buildyourown](https://github.com/shreyabadakundri/buildyourown)

**BuildWithMe Studio** is an autonomous AI venture studio and engineering proof-of-work platform. Founders submit structured pitches; Cohere acts as a technical co-founder; results land in **MongoDB Atlas** with shareable architecture diagrams, SQL, and a 14-day sprint plan.

## Architecture

```mermaid
flowchart LR
  A[Landing + Pitch Form] --> B[/api/submit-pitch]
  B --> C[Zod + Rate Limit]
  C --> D[Cohere JSON]
  D --> E[MongoDB pitches]
  E --> F[Resend emails]
  E --> G[/pitch/id results]
  H[Reverse Pitch Modal] --> I[/api/reverse-pitch]
  I --> D
  J[Admin Dashboard] --> K[/api/admin/*]
```

## Tech stack

- **Next.js 14+** (App Router), TypeScript, Tailwind CSS
- **MongoDB Atlas** — pitch persistence
- **Cohere** (`command-a-03-2025`) with JSON schema structured output
- **Resend** — transactional email
- **Zod** — validation
- **Mermaid** — client-side architecture diagrams
- **lucide-react** — icons

## Features

- Landing page with pipeline narrative and embedded pitch form
- **1-Click Demo Mode** — prefills a realistic B2B AI SaaS pitch
- **Hiring? Test My Engineering** — reverse-pitch modal with 7-day ship plan
- Automated pitch scoring, Mermaid architecture, PostgreSQL schema snippet, sprint roadmap
- Shareable `/pitch/[id]` page with telemetry drawer
- Admin login, **dashboard** (`/admin/dashboard`), and **pitch list** (`/admin/pitches`)
- In-memory IP rate limiting (5 requests / 10 minutes)

## Setup

1. Clone and install:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Configure MongoDB Atlas — see `mongodb/ATLAS_SETUP.md`.

4. Fill `.env.local` with `MONGODB_URI`, `COHERE_API_KEY`, and admin credentials.

5. Run the dev server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | Database name (default `buildwithme`) |
| `COHERE_API_KEY` | Pitch + reverse-pitch AI |
| `RESEND_API_KEY` | Email (optional locally) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin login |
| `ADMIN_EMAIL` | Shortlist notifications |
| `CALCOM_LINK` / `NEXT_PUBLIC_CALCOM_LINK` | Booking links |

## Rate limiting

`lib/rate-limit.ts` tracks requests per IP in memory. Suitable for single-instance MVP; use Redis/Upstash for multi-instance production.

## License

MIT — use as portfolio / venture-studio template.