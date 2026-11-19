import { createSupabaseContext, withSupabase } from '@supabase/server';

/**
 * Creates a server-side Supabase context from an incoming Request.
 * Automatically verifies auth and connects to Supabase using env variables:
 * - SUPABASE_URL
 * - SUPABASE_PUBLISHABLE_KEY
 * - SUPABASE_SECRET_KEY
 * - SUPABASE_JWKS_URL
 */
export async function getServerContext(req: Request) {
  return await createSupabaseContext(req);
}

export { withSupabase };
