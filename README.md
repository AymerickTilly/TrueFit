<img src="https://raw.githubusercontent.com/AymerickTilly/TrueFit/main/src/assets/logo.svg" alt="TrueFit" height="60" />

# TrueFit

**A clear picture of how your CV could look — without putting words in your mouth.**

TrueFit helps you understand how your real experience maps to a job offer. You build a profile once, paste a job posting, and the AI surfaces which of your actual skills and experiences are most relevant — giving you an honest, structured view of what your CV could look like for that role.

It is not a tool that writes your CV for you. It does not invent skills, inflate titles, or generate experience you do not have. What it produces is a foundation — a reflection of your real background shaped by the requirements of a specific job.

> Built by a junior developer for junior developers, but designed for anyone.

---

## Why this exists

Most AI CV tools either rewrite your CV into generic corporate language or invent experience you do not have. TrueFit works differently. You define your real skills inventory once, and the AI selects and frames the most relevant parts for each specific job — without adding anything that is not already there.

The output is not a finished CV ready to submit. It is a starting point: structured, honest, and job-specific. You review it, refine it, and make it yours.

---

## What it does

- **Skill inventory builder** — Add your skills with context (professional, academic, or still learning) and usage descriptions. These become the only pool the AI draws from.
- **Job offer input** — Paste any job posting. TrueFit identifies which of your skills are relevant to that role.
- **CV overview generation** — Receive a structured draft that selects and frames your real experience for the specific job. Think of it as a first pass, not a finished document.
- **Applications log** — Track every role you have pasted in, with a status (draft, applied, interviewing, rejected, offered) and a link to regenerate or review the output at any time.
- **Profile sections** — Work experience, education, projects, volunteering, and personal interests are all included in the profile and used to shape the output.

---

## What it does not do

- It does not fabricate skills or experience.
- It does not produce a submission-ready CV — you still need to review, adjust, and format the output to your standard.
- It does not write cover letters (planned, not yet built).
- It does not export to PDF (planned, not yet built).

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite + TailwindCSS |
| Database & Auth | Supabase (Postgres + Row Level Security + Edge Functions) |
| AI | Groq API (free tier) via Supabase Edge Function |
| Hosting | Vercel (frontend) + Supabase (backend) |

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works fine)
- A [Groq](https://console.groq.com) API key (free tier)

### Installation

```bash
# Clone the repo
git clone https://github.com/AymerickTilly/TrueFit.git
cd TrueFit

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and Groq API key

# Run database migrations
npx supabase db push

# Start the dev server
npm run dev
```

### Environment variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key   # server-side only, lives in the Edge Function — never in src/
```

---

## Project structure

```
TrueFit/
├── docs/                  # Architecture decisions and roadmap
├── src/
│   ├── components/
│   │   ├── ui/            # Shared primitives (Button, Input, Badge, Spinner, etc.)
│   │   ├── profile/       # Skill builder, experience, education, project, volunteering forms
│   │   ├── job/           # Job offer input, application card
│   │   └── layout/        # App shell, topbar, protected route, page transitions
│   ├── pages/             # Route-level views (Profile, Applications, Generate, Account, auth pages)
│   ├── lib/
│   │   ├── prompts/       # Prompt assembly logic — the most sensitive part of the codebase
│   │   ├── api/           # Supabase client and query helpers
│   │   └── utils/         # Shared helpers (cn, etc.)
│   ├── hooks/             # useAuth, useProfile, useReveal
│   └── types/             # TypeScript interfaces and types
├── supabase/
│   ├── migrations/        # SQL schema (versioned — never edit directly, always create a new migration)
│   └── functions/
│       └── generate-documents/  # Edge Function — the only place the Groq API key is used
└── public/
```

---

## How the AI integration works

The core of TrueFit is a prompt assembly system in `src/lib/prompts/`. When you generate:

1. Your full profile (skills, experience, projects, education) is loaded from Supabase.
2. The job offer text is provided as context.
3. A structured prompt is assembled, combining your profile with the job offer.
4. The prompt is sent to the Groq API via a Supabase Edge Function — keeping the API key server-side at all times.
5. The response is displayed as a structured overview of how your experience maps to the role.

The AI operates under strict constraints: it can only select from skills you have defined, cannot reassign experience, and cannot inflate your background. See `docs/architecture.md` for the full prompt architecture.

---

## Roadmap

| Status | Item |
|---|---|
| ✅ | Project scaffold, auth, database schema |
| ✅ | App shell — topbar navigation, protected routes |
| ✅ | Profile builder — skills, experience, education, projects, volunteering, interests |
| ✅ | Applications log with status tracking |
| ✅ | CV overview generation via Groq |
| ✅ | Generate page — job selector, profile snapshot, output panel |
| ⬜ | Cover letter generation |
| ⬜ | PDF export |
| ⬜ | Streaming responses (word-by-word output) |
| ⬜ | Non-IT field support (marketing, finance, design, etc.) |
| ⬜ | Multiple CV layout templates |
| ⬜ | Demo mode — try without an account |
| ⬜ | Public deployment |

---

## Contributing

All contributions are welcome — especially non-IT field prompt templates and CV layout designs. See [`docs/architecture.md`](docs/architecture.md) for how the prompt system works before submitting changes to `src/lib/prompts/`.

---

## License

MIT. Use it, fork it, build on it.
