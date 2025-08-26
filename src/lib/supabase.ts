import { createClient } from '@supabase/supabase-js'

let supabase: any = null

export const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      return null
    }

    supabase = createClient(supabaseUrl, supabaseKey)
  }
  
  return supabase
}

// For backward compatibility
export const supabase = getSupabaseClient()
