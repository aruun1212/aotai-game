import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Supabase client — null if env vars missing
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Reactive flag: is Supabase available and reachable?
export const supabaseReady = ref(false)

// Init check — called once on app start
export async function initSupabase(): Promise<boolean> {
  if (!supabase) {
    supabaseReady.value = false
    return false
  }
  try {
    // Simple health check — try to reach the DB
    const { error } = await supabase.from('players').select('id').limit(1)
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = "no rows returned" which is fine (table exists but empty)
      // Other errors mean table doesn't exist yet or network issue
      // Still mark as ready if it's just empty table
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        // Table not yet created — we'll create it later
        supabaseReady.value = true
        return true
      }
      console.warn('[Supabase] Health check failed:', error.message)
      supabaseReady.value = false
      return false
    }
    supabaseReady.value = true
    return true
  } catch (e) {
    console.warn('[Supabase] Unreachable:', e)
    supabaseReady.value = false
    return false
  }
}
