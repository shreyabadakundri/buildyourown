# Changelog

All notable changes to **BuildWithMe Studio** are documented here.

## [1.1.0] — 2026-03-25

### Added

- **About** page and homepage About section (mission, stack, who it’s for).
- **Project log** page (`/log`) rendering this changelog in the app.
- Navbar links for About and Log.

### Changed

- Landing “How it works” copy references Cohere instead of legacy Gemini wording.

## [1.0.0] — 2026-03-25

### Added

- Full-stack **BuildWithMe Studio**: pitch intake, AI evaluation, results pages.
- **Cohere** JSON-mode architect (`command-a-03-2025`).
- **MongoDB Atlas** persistence (`buildyourown` / `pitches`) with local `data/pitches.json` dev fallback.
- Shareable `/pitch/[id]` with Mermaid, SQL snippet, sprint roadmap, telemetry drawer.
- **Reverse-pitch** modal for recruiters (7-day ship plan).
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/pitches` (charts + pitch table).
- Rate limiting, Resend email hooks, Zod validation.
- GitHub repo: [shreyabadakundri/buildyourown](https://github.com/shreyabadakundri/buildyourown).