// Supabase Edge Function — calls the Groq API server-side.
// The GROQ_API_KEY never leaves this function.
//
// Deploy:    npx supabase functions deploy generate-documents
// Secret:    npx supabase secrets set GROQ_API_KEY=your_key
// Local dev: npx supabase functions serve generate-documents

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const MAX_TOKENS: Record<string, number> = {
  analysis: 1024,
  improve:  1024,
  cv:       4096,
}
const DEFAULT_MAX_TOKENS = 2048

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PromptRequest {
  type: string
  content: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GROQ_API_KEY')
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set in Edge Function secrets')
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
        const response = await fetch(GROQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content }],
            temperature: 0.3,
            max_tokens: MAX_TOKENS[type] ?? DEFAULT_MAX_TOKENS,
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`Groq API error for ${type}: ${error}`)
        }

        const data = await response.json()
        const outputText: string = data.choices?.[0]?.message?.content ?? ''

        return {
          type,
          content: outputText,
          tokens_input:  data.usage?.prompt_tokens     ?? 0,
          tokens_output: data.usage?.completion_tokens ?? 0,
          model_used: GROQ_MODEL,
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
