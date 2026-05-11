# Contributing to TrueFit

Thanks for considering a contribution. TrueFit is a personal and portfolio project that is open to collaboration.

---

## What is most useful right now

- **Non-IT field prompt templates**: The prompt system currently assumes an IT skill inventory. Contributions that extend it for Marketing, Finance, Design, or Healthcare are highly valuable.
- **Bug reports**: If a generated CV or cover letter violates the no-fabrication rule by inventing skills or inflating experience, that is a critical bug and should be reported immediately.
- **UI improvements**: The profile builder and generation UI are the most user-facing parts of the app and have the most room for improvement.
- **Documentation**: Clearer setup guides are always welcome, especially for non-developers who want to use the tool.

---

## Getting started

1. Fork the repo and clone it locally.
2. Follow the setup steps in the README.
3. Create a branch: `git checkout -b your-feature-name`
4. Make your changes.
5. Run `npm run lint` and `npm run typecheck`. Both must pass before opening a pull request.
6. Open a pull request with a clear description of what changed and why.

---

## Code standards

- TypeScript strict mode. Do not use `any`.
- Named exports only.
- Components must stay under 200 lines.
- Never put the Anthropic API key anywhere in `src/`.
- All Supabase queries must use Row Level Security.

---

## The non-negotiable rule

**TrueFit must never fabricate experience.** Any change to the prompt system that could cause the AI to invent skills, inflate seniority, or reassign a skill to a context it does not belong to will be rejected. This is the core promise of the tool.

---

## Questions

Open an issue or start a discussion. Pull requests are reviewed promptly.
