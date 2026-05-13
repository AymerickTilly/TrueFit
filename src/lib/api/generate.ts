import { supabase } from '@/lib/api/supabase'
import type { ProfileWithSkills, JobApplication } from '@/types'
import { assemblePrompt } from '@/lib/prompts/assemble-prompt'

export interface GenerateResult {
  content: string
  tokensInput: number
  tokensOutput: number
}

export async function generateCV(
  profile: ProfileWithSkills,
  application: JobApplication,
): Promise<{ data: GenerateResult | null; error: string | null }> {
  const prompt = assemblePrompt(profile, application)

  const { data, error } = await supabase.functions.invoke('generate-documents', {
    body: { prompts: [{ type: 'cv', content: prompt }] },
  })

  if (error) return { data: null, error: error.message }

  const doc = data?.documents?.[0]
  if (!doc) return { data: null, error: 'No output returned from Gemini.' }
  if (data.error) return { data: null, error: data.error }

  return {
    data: {
      content:      doc.content,
      tokensInput:  doc.tokens_input,
      tokensOutput: doc.tokens_output,
    },
    error: null,
  }
}
