
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_BACKEND_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPA_ANON_KEY!;

if(!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE URL or key is not defined in environmental variables');
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;