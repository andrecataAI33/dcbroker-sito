import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://suozcdhoyssyfxmatsji.supabase.co'
const supabaseKey = 'sb_publishable_FP2LL11CQQAQLDygYysIew_YMNd0G-L'

export const supabase = createClient(supabaseUrl, supabaseKey)
