// backend/src/utils/supabaseAdmin.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';

export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (url: RequestInfo | URL, init?: RequestInit) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30_000);
        const modifiedInit = { ...(init || {}), signal: controller.signal };
        return fetch(url, modifiedInit).finally(() => clearTimeout(timeout));
      },
    },
  }
);

export const getUserIdFromJwt = (jwt: string): string | null => {
  try {
    const payload = jwt.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    const obj = JSON.parse(decoded);
    return obj.sub || null;
  } catch {
    return null;
  }
};
