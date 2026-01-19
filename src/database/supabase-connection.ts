import {createClient} from '@supabase/supabase-js'

if(process.env.SUPABASE_URL && process.env.SUPABASE_KEY){
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
}