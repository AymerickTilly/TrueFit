// Supabase Edge Function — calls the Gemini API server-side.
// The GEMINI_API_KEY never leaves this function.
//
// Deploy:    npx supabase functions deploy generate-documents
// Secret:    npx supabase secrets set GEMINI_API_KEY=your_key
// Local dev: npx supabase functions serve generate-documents

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
const MAX_TOKENS = 4096

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PromptRequest {
  type: string
  content: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in Edge Function secrets')
    }

    const body = await req.json()
    const { prompts } = body as { prompts: PromptRequest[] }

    if (!prompts || !Array.isArray(prompts)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: prompts array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const results = await Promise.all(
      prompts.map(async ({ type, content }) => {
        const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: content }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: MAX_TOKENS,
            },
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`Gemini API error for ${type}: ${error}`)
        }

        const data = await response.json()
        const outputText: string = data.candidates?.[0]?.content?.parts
          ?.map((p: { text: string }) => p.text)
          .join('') ?? ''

        return {
          type,
          content: outputText,
          tokens_input:  data.usageMetadata?.promptTokenCount     ?? 0,
          tokens_output: data.usageMetadata?.candidatesTokenCount ?? 0,
          model_used: 'gemini-2.0-flash',
        }
      }),
    )

    return new Response(
      JSON.stringify({ documents: results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Edge Function error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
