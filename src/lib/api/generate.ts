import { supabase } from '@/lib/api/supabase'
import type { ProfileWithSkills, JobApplication } from '@/types'
import {
  assembleAnalysisPrompt,
  assembleGenerationPrompt,
  type GapAnalysis,
} from '@/lib/prompts/assemble-prompt'

export interface GenerateResult {
  content: string
  tokensInput: number
  tokensOutput: number
}

export type GenerateStep = 'analyzing' | 'generating'

async function invokeEdgeFunction(
  type: string,
  content: string,
): Promise<{ doc: { content: string; tokens_input: number; tokens_output: number } | null; error: string | null }> {
  const { data, error } = await supabase.functions.invoke('generate-documents', {
    body: { prompts: [{ type, content }] },
  })
  if (error) return { doc: null, error: error.message }
  const doc = data?.documents?.[0]
  if (!doc) return { doc: null, error: 'No output returned from the model.' }
  return { doc, error: null }
}

export async function generateCV(
  profile: ProfileWithSkills,
  application: JobApplication,
  onStep?: (step: GenerateStep) => void,
): Promise<{ data: GenerateResult | null; error: string | null }> {
  // Stage 1: gap analysis
  onStep?.('analyzing')

  const { doc: analysisDoc, error: analysisError } = await invokeEdgeFunction(
    'analysis',
    assembleAnalysisPrompt(profile, application),
  )
  if (analysisError) return { data: null, error: analysisError }

  let analysis: GapAnalysis = {
    direct_matches:      [],
    partial_matches:     [],
    missing_required:    [],
    preferred_matches:   [],
    role_themes:         [],
    key_responsibilities: [],
    company_focus:       '',
    what_matters_most:   '',
    tone_signal:         'technical/precise',
    soft_skills_valued:  [],
  }
  try {
    analysis = JSON.parse(analysisDoc!.content) as GapAnalysis
  } catch {
    // Proceed with empty analysis — generation still works, just without prioritisation
  }

  // Stage 2: CV generation
  onStep?.('generating')

  const { doc: cvDoc, error: cvError } = await invokeEdgeFunction(
    'cv',
    assembleGenerationPrompt(profile, application, analysis),
  )
  if (cvError) return { data: null, error: cvError }

  return {
    data: {
      content:      cvDoc!.content,
      tokensInput:  (analysisDoc?.tokens_input ?? 0) + cvDoc!.tokens_input,
      tokensOutput: (analysisDoc?.tokens_output ?? 0) + cvDoc!.tokens_output,
    },
    error: null,
  }
}
