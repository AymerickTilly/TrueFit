# Roadmap

Progress tracked here. Contributions welcome on any open item.

---

## Phase 1 — Foundation (current)

- [x] Project scaffold and directory structure
- [x] README, CLAUDE.md, architecture docs
- [x] TypeScript types (data model)
- [x] Supabase schema (migrations)
- [x] Prompt assembly engine
- [x] Supabase Edge Function (Claude API caller)
- [x] Supabase client and query helpers
- [x] Vite + React + TailwindCSS project init (`npm create vite@latest`)
- [ ] Supabase auth (login, signup, logout)
- [ ] Basic app shell (navigation, sidebar, layout)

## Phase 2 — Profile builder

- [ ] Skills input UI (add skill, set context, write usage description)
- [ ] AI-assisted skill categorisation (call Claude to suggest which group a skill belongs to)
- [ ] Skill groups display (grouped by category, clusters)
- [ ] Work experience form (title, company, dates, tasks as bullets, tools)
- [ ] Education form
- [ ] Projects form (with not_in_project field — important for prompt accuracy)
- [ ] Volunteering and interests forms
- [ ] Profile save to Supabase

## Phase 3 — Generation

- [ ] Job offer input (paste raw text + optional URL)
- [ ] Job analysis (call Claude to extract structured analysis, save to DB)
- [ ] Gap analysis display (show which required skills are missing)
- [ ] CV generation
- [ ] Cover letter generation (full version)
- [ ] Cover letter generation (short text-box version)
- [ ] Output display with copy-to-clipboard
- [ ] Save generated documents to Supabase

## Phase 4 — Export and tracking

- [ ] PDF export (react-pdf, using the user's CV template style)
- [ ] Applications log (list of all jobs applied to, status, date)
- [ ] Status tracking (draft → applied → interviewing → rejected / offered)
- [ ] Link to generated documents from application log

## Phase 5 — Polish and openness

- [ ] Streaming responses (show generation word by word)
- [ ] Non-IT field support (different skill categories and prompt logic for Marketing, Finance, etc.)
- [ ] Multiple CV templates
- [ ] Public deployment (Vercel + Supabase)
- [ ] Demo mode (try without creating an account)

## Ideas for later

- Import LinkedIn profile to pre-fill the profile builder
- Browser extension to extract job posting text automatically
- Email integration to track application replies
- Analytics dashboard (applications sent, response rate, etc.)
