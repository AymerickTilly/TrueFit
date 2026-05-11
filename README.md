# CVGen — AI-Powered CV & Cover Letter Generator

**Tailored job applications in seconds, without lying.**

CVGen takes your real skills, experience, and projects, and generates a tailored CV and cover letter for any job offer using Claude AI. It surfaces the most relevant parts of your background honestly — no fabricated skills, no inflated titles, no hallucinated experience.

> Built by a junior developer for junior developers, but designed for anyone.

---

## Why this exists

Most AI CV tools either rewrite your CV into generic corporate language or invent experience you don't have. CVGen works differently: you define your real skills inventory once, and the AI selects and frames the most relevant parts for each specific job — never adding what isn't there.

---

## Features

- **Skill inventory builder** — define skills with context (professional / academic / learning), usage descriptions, and groupings auto-suggested by AI
- **Job offer analysis** — paste a job posting, get a structured breakdown of requirements and gaps
- **CV generation** — tailored, honest CV based on your real experience
- **Cover letter generation** — full letter or short text-box version
- **Applications log** — track every job you applied to with the documents generated
- **Multi-user support** — anyone can create a profile and use the tool
- **Field-agnostic** — built for IT first, designed to work for any profession

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite + TailwindCSS |
| Database & Auth | Supabase (Postgres + Edge Functions) |
| AI | Claude API (`claude-sonnet-4-20250514`) |
| PDF export | react-pdf |
| Hosting | Vercel (frontend) + Supabase (backend) |

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier)
- An [Anthropic](https://console.anthropic.com) API key

### Installation

```bash
# Clone the repo
git clone https://github.com/AymerickTilly/cv-gen.git
cd cv-gen

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and Anthropic API key

# Run database migrations
npx supabase db push

# Start the dev server
npm run dev
```

### Environment variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key   # server-side only, via Edge Function
```

---

## Project structure

```
cv-gen/
├── docs/                  # Architecture decisions, prompt system docs, roadmap
├── src/
│   ├── components/        # React UI components
│   │   ├── ui/            # Shared primitives (Button, Input, Card, etc.)
│   │   ├── profile/       # Skill builder, experience forms
│   │   ├── job/           # Job offer input and analysis
│   │   ├── generation/    # CV and cover letter output
│   │   └── layout/        # App shell, navigation, sidebar
│   ├── pages/             # Route-level views
│   ├── lib/
│   │   ├── prompts/       # Prompt assembly logic (the core of the AI integration)
│   │   ├── api/           # Supabase client, Claude API caller
│   │   └── utils/         # Shared helpers
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript interfaces and types
├── supabase/
│   ├── migrations/        # SQL schema (versioned, never edit directly)
│   └── functions/
│       └── generate-documents/  # Edge Function: calls Claude API server-side
└── public/
    └── templates/         # CV layout templates
```

---

## How the AI integration works

The core of CVGen is a prompt assembly system in `src/lib/prompts/`. When you generate a CV:

1. Your full profile (skills, experience, projects) is loaded from Supabase
2. The job offer text is analysed to extract requirements and gaps
3. A structured prompt is assembled, combining your profile with the job analysis
4. This is sent to Claude via a Supabase Edge Function (keeping the API key server-side)
5. Claude returns a tailored CV and cover letter, which are parsed and displayed

The AI operates under strict constraints: it can only use skills you've defined, cannot reassign a skill to a context it doesn't belong to, and cannot inflate your experience. See `docs/prompts.md` for the full prompt architecture.

---

## Roadmap

See [`docs/roadmap.md`](docs/roadmap.md) for the full plan. Short version:

- [x] Project scaffold and documentation
- [ ] Profile builder UI
- [ ] Supabase auth and database
- [ ] Prompt assembly engine
- [ ] Claude API integration
- [ ] CV and cover letter generation
- [ ] PDF export
- [ ] Applications log
- [ ] Non-IT field support
- [ ] Public deployment

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). All contributions welcome — especially non-IT field prompt templates.

---

## License

MIT — use it, fork it, build on it.
