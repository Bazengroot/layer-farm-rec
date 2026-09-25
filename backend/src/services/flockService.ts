import { supabaseAdmin } from '../utils/supabaseAdmin';

export async function getFlocks() {
  const { data, error } = await supabaseAdmin
    .from('flocks')
    .select('id, name')
    .order('name');
  if (error) {
    console.error('Error fetching flocks:', error);
    throw error;
  }
  return data;
}
