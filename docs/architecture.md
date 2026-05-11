# Architecture decisions

This document explains the technical choices made in TrueFit and why, so that contributors and future maintainers understand the reasoning behind each decision, not just the implementation.

---

## Frontend: React + TypeScript + Vite + TailwindCSS

**React** is chosen because the profile builder, job analysis, and generation output are all complex stateful UIs. React's component model maps well to the profile sections (one component per skill group, one per work experience entry, and so on).

**TypeScript** is non-negotiable for a project that stores structured user data. The types in `src/types/index.ts` mirror the database schema exactly. If a column changes in Postgres, the type changes here too, and TypeScript catches every broken reference at compile time.

**Vite** is chosen over Create React App for faster build times, native ESM support, and a better overall developer experience.

**TailwindCSS** handles styling through a utility-first approach, which means components are self-contained and consistent without needing a separate CSS architecture to maintain.

---

## Database: Supabase (Postgres)

### Why not MongoDB?

The data in TrueFit is relational:
- A user has one profile.
- A profile has many skill items.
- A user has many job applications.
- A job application has many generated documents.

These relationships are enforced with foreign keys and cascade deletes in Postgres. MongoDB could handle this, but it would require either embedding everything (a single giant document per user, which is hard to query and update) or managing references manually without the database enforcing integrity.

### Why Supabase specifically?

Three reasons:

1. **Edge Functions**: Serverless functions that run on Deno, deployed alongside the database. This is where the Anthropic API key lives. There is no separate Express or Fastify server to host, deploy, or maintain, and the API key never touches the frontend.

2. **Row Level Security**: Postgres RLS policies enforce that users can only access their own data at the database level. Even if there is a bug in the frontend, a user cannot read another user's profile. This is a security guarantee that would have to be built manually with a separate backend.

3. **Built-in auth**: Email and password login, plus OAuth (Google, GitHub), are available out of the box, with JWTs that Supabase functions automatically verify.

---

## AI integration: Claude API via Edge Function

### Why an Edge Function and not a direct frontend call?

The Anthropic API key must never appear in the frontend. A browser-side JavaScript file is visible to anyone who opens DevTools. If the key were included, it would be immediately exposed and could be used to run up charges on the account.

The Edge Function acts as a secure proxy:
1. The frontend sends the assembled prompt without the key.
2. The Edge Function adds the key server-side and calls the Claude API.
3. The Edge Function returns the result to the frontend.

### Why `claude-sonnet-4-20250514`?

Sonnet is the right balance of quality and speed for this use case. The CV and cover letter prompts are detailed and constraint-heavy, so they need a model that follows complex instructions reliably. Haiku would be faster and cheaper but misses more of the constraints. Opus would produce higher quality output but is significantly more expensive for a daily-use tool.

### Why not stream the response?

Streaming is planned for a later iteration. The current implementation waits for the full response, which is simpler to implement correctly and easier to parse. The tradeoff is a 10-20 second wait during generation, which is acceptable for a document generation tool but worth improving in future.

---

## Prompt architecture

The prompts in `src/lib/prompts/assembler.ts` are derived from a manually tested 9-prompt system. The key design principle is **strict context isolation**: each skill has a context tag (professional, academic, learning, or exposure), and the prompt explicitly forbids the model from reassigning skills to different contexts.

This is the constraint that makes TrueFit different from generic AI CV tools. It cannot fabricate experience. The database stores what you have actually done, and the prompt enforces that boundary.

See `docs/prompts.md` for the full prompt architecture documentation.

---

## Hosting

- **Frontend**: Vercel. The free tier supports automatic deploys from GitHub with zero configuration for Vite projects.
- **Backend**: Supabase. The free tier includes 500MB of database storage, 1GB of file storage, and 2 Edge Function invocations per second.

For a personal project or small team, both free tiers are sufficient indefinitely.
