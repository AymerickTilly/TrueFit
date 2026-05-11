# Contributing to TrueFit

Thanks for considering a contribution. TrueFit is a personal/portfolio project open to collaboration.

---

## What's most useful right now

- **Non-IT field prompt templates** — the prompt system currently assumes an IT skill inventory. Contributions that extend it for Marketing, Finance, Design, Healthcare, etc. are highly valuable.
- **Bug reports** — if a generated CV or cover letter violates the no-fabrication rule (invents skills or inflates experience), that's a critical bug.
- **UI improvements** — the profile builder and generation UI are the most user-facing parts and have the most room for improvement.
- **Documentation** — clearer setup guides, especially for non-developers who want to use the tool.

---

## Getting started

1. Fork the repo and clone it locally
2. Follow the setup steps in the README
3. Create a branch: `git checkout -b your-feature-name`
4. Make your changes
5. Run `npm run lint` and `npm run typecheck` — both must pass
6. Open a pull request with a clear description of what changed and why

---

## Code standards

- TypeScript strict mode — no `any`
- Named exports only
- Components under 200 lines
- No Anthropic API key in `src/` — ever
- All Supabase queries must use Row Level Security

---

## The non-negotiable rule

**TrueFit must never fabricate experience.** Any change to the prompt system that could cause the AI to invent skills, inflate seniority, or reassign a skill to a context it doesn't belong to will be rejected. This is the core promise of the tool.

---

## Questions

Open an issue or start a discussion. Pull requests are reviewed promptly.
