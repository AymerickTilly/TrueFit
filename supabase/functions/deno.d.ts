// Minimal Deno globals for VS Code type checking.
// The real types come from the Deno runtime when deployed to Supabase.
declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void
  env: {
    get: (key: string) => string | undefined
  }
}
