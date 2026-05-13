import { supabase } from '@/lib/api/supabase'

export async function improveTasks(
  tasks: string,
  tools: string[],
  context: { title: string; company: string },
): Promise<{ data: string | null; error: string | null }> {
  const toolsStr = tools.length > 0 ? tools.join(', ') : 'not specified'

  const prompt = `You are a professional CV writer. Improve these work experience bullet points.

STRICT RULES — NEVER VIOLATE:
1. Only extend what is already written with a light outcome or consequence clause. Do not invent new responsibilities or change the meaning.
2. Never add skills, tools, or technologies not listed in TOOLS USED below.
3. Never fabricate metrics, percentages, or specific numbers.
4. No em-dashes (— or --). Replace with a comma or connector word.
5. Banned phrases: "proven track record", "dynamic", "leverage", "passionate", "results-driven", "showcasing", "utilizing", "strong understanding", "strong foundation".
6. Each bullet must be one concise sentence. No multi-sentence bullets.
7. If a bullet already has a clear outcome clause, keep it as-is — only improve bullets that describe a bare task with no consequence.
8. Active verbs only. Direct, concrete language.

ROLE: ${context.title} at ${context.company}
TOOLS USED IN THIS ROLE: ${toolsStr}

CURRENT BULLETS (one per line):
${tasks}

EXAMPLE of the improvement style:
Before: "Automated Linux server deployments"
After:  "Automated Linux server and database deployments using Ansible, reducing manual intervention and minimising human error risk across recurring operational tasks."

Before: "Managed SQL databases"
After:  "Managed and queried SQL databases (MySQL/PostgreSQL), maintaining data integrity and reliable access for ongoing operations and downstream processing."

Return ONLY the improved bullets, one per line, in the same order. No explanation, no commentary, no preamble.`

  const { data, error } = await supabase.functions.invoke('generate-documents', {
    body: { prompts: [{ type: 'improve', content: prompt }] },
  })

  if (error) return { data: null, error: error.message }
  const doc = data?.documents?.[0]
  if (!doc) return { data: null, error: 'No suggestion returned.' }
  return { data: doc.content.trim(), error: null }
}
