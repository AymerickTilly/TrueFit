// supabase/functions/generate-documents/index.ts
// Supabase Edge Function — calls the Claude API server-side.
// The Anthropic API key NEVER leaves this function.
//
// Deployed via: npx supabase functions deploy generate-documents
// Local dev:    npx supabase functions serve generate-documents

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 4096

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in Edge Function secrets')
    }

    const body = await req.json()
    const { prompts } = body as { prompts: { type: string; content: string }[] }

    if (!prompts || !Array.isArray(prompts)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: prompts array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Claude for each prompt in sequence
    const results = await Promise.all(
      prompts.map(async ({ type, content }) => {
        const response = await fetch(ANTHROPIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            messages: [{ role: 'user', content }],
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`Claude API error for ${type}: ${error}`)
        }

        const data = await response.json()
        const outputText = data.content
          .filter((block: { type: string }) => block.type === 'text')
          .map((block: { text: string }) => block.text)
          .join('\n')

        return {
          type,
          content: outputText,
          tokens_input: data.usage?.input_tokens ?? 0,
          tokens_output: data.usage?.output_tokens ?? 0,
          model_used: MODEL,
        }
      })
    )

    return new Response(
      JSON.stringify({ documents: results }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Edge Function error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
