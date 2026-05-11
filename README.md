# TrueFit: AI-Powered CV and Cover Letter Generator

**Tailored job applications in seconds, without lying.**

TrueFit takes your real skills, experience, and projects, and generates a tailored CV and cover letter for any job offer using Claude AI. It surfaces the most relevant parts of your background honestly. It never fabricates skills, inflates titles, or hallucinates experience.

> Built by a junior developer for junior developers, but designed for anyone.

---

## Why this exists

Most AI CV tools either rewrite your CV into generic corporate language or invent experience you do not have. TrueFit works differently. You define your real skills inventory once, and the AI selects and frames the most relevant parts for each specific job without adding anything that is not already there.

---

## Features

- **Skill inventory builder**: Define your skills with context tags (professional, academic, or learning), write usage descriptions, and get AI-suggested groupings.
- **Job offer analysis**: Paste any job posting and receive a structured breakdown of requirements and skill gaps.
- **CV generation**: Generate a tailored, honest CV based entirely on your real experience.
- **Cover letter generation**: Generate either a full cover letter or a short text-box version.
- **Applications log**: Track every job you have applied to, alongside the documents generated for each application.
- **Multi-user support**: Anyone can create an account and build their own skill inventory.
- **Field-agnostic**: Built for IT roles first, but designed to work for any profession.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite + TailwindCSS |
| Database and Auth | Supabase (Postgres + Edge Functions) |
| AI | Claude API (`claude-sonnet-4-20250514`) |
| PDF export | react-pdf |
| Hosting | Vercel (frontend) + Supabase (backend) |

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works fine)
- An [Anthropic](https://console.anthropic.com) API key

### Installation

```bash
# Clone the repo
git clone https://github.com/AymerickTilly/TrueFit.git
cd TrueFit

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
ANTHROPIC_API_KEY=your_anthropic_api_key   # server-side only, lives in the Edge Function
```

---

## Project structure

```
TrueFit/
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
│   │   ├── api/           # Supabase client
│   │   └── utils/         # Shared helpers
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript interfaces and types
├── supabase/
│   ├── migrations/        # SQL schema (versioned, never edit directly)
│   └── functions/
│       └── generate-documents/  # Edge Function that calls the Claude API server-side
└── public/
    └── templates/         # CV layout templates
```

---

## How the AI integration works

The core of TrueFit is a prompt assembly system in `src/lib/prompts/`. When you generate a CV:

1. Your full profile (skills, experience, projects) is loaded from Supabase.
2. The job offer text is analysed to extract requirements and gaps.
3. A structured prompt is assembled, combining your profile with the job analysis.
4. The prompt is sent to Claude via a Supabase Edge Function, which keeps the API key server-side.
5. Claude returns a tailored CV and cover letter, which are then parsed and displayed.

The AI operates under strict constraints. It can only use skills you have defined, cannot reassign a skill to a context it does not belong to, and cannot inflate your experience. See `docs/prompts.md` for the full prompt architecture.

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

See [`CONTRIBUTING.md`](CONTRIBUTING.md). All contributions are welcome, especially non-IT field prompt templates.

---

## License

MIT. Use it, fork it, build on it.
