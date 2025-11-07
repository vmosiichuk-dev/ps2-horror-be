import type { Database } from './database.types.ts';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env.ts';

export const supabase = createClient<Database>(
	ENV.SUPABASE_URL,
	ENV.SUPABASE_SECRET_KEY,
	{
		auth: {
			persistSession: false
		}
	}
);
